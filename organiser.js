// ── Organiser Dashboard ─────────────────────────────────────────────────────

function renderOrganiser(user) {
  let showModal = false;
  let editTarget = null; // null = add, object = edit
  let filterCat = '';
  let filterQ   = '';

  const CATEGORIES = ['Technical', 'Cultural', 'Career', 'Sports', 'Workshop', 'Other'];

  function events() {
    return Store.getEvents().filter(e => {
      const matchCat = !filterCat || e.category === filterCat;
      const matchQ   = !filterQ   || e.title.toLowerCase().includes(filterQ.toLowerCase());
      return matchCat && matchQ;
    });
  }

  function stats() {
    const all = Store.getEvents();
    const now = new Date().toISOString().split('T')[0];
    return {
      total:    all.length,
      upcoming: all.filter(e => e.date >= now).length,
      closed:   all.filter(e => e.deadline < now).length,
      regs:     all.reduce((s, e) => s + e.registrations.length, 0),
    };
  }

  function html() {
    const s = stats();
    const evs = events();
    return `
    <nav>
      <h1>🏫 EventHub — Organiser</h1>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:0.88rem">👤 ${user.name}</span>
        <button onclick="App.logout()">Logout</button>
      </div>
    </nav>
    <div class="container">
      <div class="dash-header">
        <h2>Manage Events</h2>
        <button class="btn btn-primary" onclick="orgOpenModal(null)">+ Add Event</button>
      </div>

      <div class="stats-row">
        <div class="stat-box"><div class="num">${s.total}</div><div class="lbl">Total Events</div></div>
        <div class="stat-box"><div class="num">${s.upcoming}</div><div class="lbl">Upcoming</div></div>
        <div class="stat-box"><div class="num">${s.closed}</div><div class="lbl">Closed</div></div>
        <div class="stat-box"><div class="num">${s.regs}</div><div class="lbl">Registrations</div></div>
      </div>

      <div class="filter-bar">
        <input placeholder="🔍 Search events…" value="${filterQ}" oninput="orgFilter('q', this.value)" />
        <select onchange="orgFilter('cat', this.value)">
          <option value="">All Categories</option>
          ${CATEGORIES.map(c => `<option value="${c}" ${filterCat===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>

      ${evs.length === 0 ? `<div class="empty"><div class="icon">📭</div><p>No events found.</p></div>` :
        evs.map(e => eventCard(e)).join('')}
    </div>
    ${showModal ? modalHtml() : ''}
    `;
  }

  function eventCard(e) {
    const ds = Store.deadlineStatus(e.deadline);
    const isPast = new Date(e.deadline) < new Date(new Date().toDateString());
    return `
    <div class="event-card ${isPast ? 'deadline-urgent' : ''}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
        <h3>${e.title}</h3>
        <span class="badge badge-blue">${e.category}</span>
      </div>
      <div class="meta">
        <span>📅 Event: ${e.date}</span>
        <span>⏰ Deadline: ${e.deadline}</span>
        <span>📍 ${e.venue}</span>
        <span>👥 ${e.registrations.length}/${e.maxSeats} registered</span>
      </div>
      <p style="font-size:0.88rem;color:#4a5568;margin-bottom:10px">${e.description}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span class="badge ${ds.cls}">Deadline: ${ds.label}</span>
        <div class="actions">
          <button class="btn btn-outline btn-sm" onclick="orgOpenModal('${e.id}')">✏️ Edit</button>
          <button class="btn btn-danger btn-sm"  onclick="orgDelete('${e.id}')">🗑 Delete</button>
        </div>
      </div>
    </div>`;
  }

  function modalHtml() {
    const e = editTarget;
    const title = e ? 'Edit Event' : 'Add New Event';
    return `
    <div class="modal-overlay" onclick="orgCloseModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <h3>${title}</h3>
        <div class="form-group">
          <label>Event Title *</label>
          <input id="m-title" value="${e?.title || ''}" placeholder="e.g. Tech Fest 2025" />
        </div>
        <div class="form-group">
          <label>Category *</label>
          <select id="m-cat">
            ${CATEGORIES.map(c => `<option value="${c}" ${(e?.category||'')=== c?'selected':''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="m-desc">${e?.description || ''}</textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label>Event Date *</label>
            <input id="m-date" type="date" value="${e?.date || ''}" />
          </div>
          <div class="form-group">
            <label>Registration Deadline *</label>
            <input id="m-deadline" type="date" value="${e?.deadline || ''}" />
          </div>
        </div>
        <div class="form-group">
          <label>Venue</label>
          <input id="m-venue" value="${e?.venue || ''}" placeholder="e.g. Main Auditorium" />
        </div>
        <div class="form-group">
          <label>Max Seats</label>
          <input id="m-seats" type="number" value="${e?.maxSeats || 100}" min="1" />
        </div>
        <div id="modal-err" class="alert alert-error" style="display:none"></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="orgCloseModal()">Cancel</button>
          <button class="btn btn-primary" onclick="orgSave()">💾 Save</button>
        </div>
      </div>
    </div>`;
  }

  function render() { document.getElementById('app').innerHTML = html(); }

  // Globals
  window.orgFilter = (key, val) => {
    if (key === 'q') filterQ = val; else filterCat = val;
    render();
  };

  window.orgOpenModal = (id) => {
    editTarget = id ? Store.getEvents().find(e => e.id === id) : null;
    showModal = true;
    render();
  };

  window.orgCloseModal = (ev) => {
    if (ev && ev.target !== document.querySelector('.modal-overlay')) return;
    showModal = false; editTarget = null; render();
  };

  window.orgDelete = (id) => {
    if (confirm('Delete this event?')) { Store.deleteEvent(id); render(); }
  };

  window.orgSave = () => {
    const title    = document.getElementById('m-title').value.trim();
    const category = document.getElementById('m-cat').value;
    const desc     = document.getElementById('m-desc').value.trim();
    const date     = document.getElementById('m-date').value;
    const deadline = document.getElementById('m-deadline').value;
    const venue    = document.getElementById('m-venue').value.trim();
    const maxSeats = parseInt(document.getElementById('m-seats').value) || 0;

    const errEl = document.getElementById('modal-err');
    if (!title || !date || !deadline) {
      errEl.textContent = 'Title, date and deadline are required.';
      errEl.style.display = 'block'; return;
    }
    if (deadline > date) { /* ok */ }
    if (deadline > date) {
      errEl.textContent = 'Deadline must be on or before the event date.';
      errEl.style.display = 'block'; return;
    }

    const payload = { title, category, description: desc, date, deadline, venue, maxSeats, organiser: user.name };
    if (editTarget) { Store.updateEvent({ ...editTarget, ...payload }); }
    else            { Store.addEvent(payload); }
    showModal = false; editTarget = null; render();
  };

  render();
}
