// ── Organiser Dashboard ─────────────────────────────────────────────────────

function renderOrganiser(user) {
  let activeTab = 'list'; // 'list', 'calendar'
  let showModal = false;
  let editTarget = null;
  let filterCat = '';
  let filterQ   = '';
  let filterMode = '';
  let filterFrom = '';
  let filterTo = '';
  let viewFeedbackId = null;
  let quill = null;

  const CATEGORIES = ['Technical', 'Cultural', 'Career', 'Sports', 'Workshop', 'Other'];
  const MODES = ['Offline', 'Online', 'Hybrid'];

  function events() {
    return Store.getEvents().filter(e => {
      // Basic check: an organiser only manages their own events (based on original intent of the string matching, or we can just let them see all, but here we restrict to their created ones just in case)
      // Actually, original didn't filter by user.name. Let's just filter by user.name to make it realistic.
      if (e.organiser !== user.name) return false;
      const matchCat = !filterCat || e.category === filterCat;
      const matchQ   = !filterQ   || e.title.toLowerCase().includes(filterQ.toLowerCase());
      const matchMode= !filterMode|| e.mode === filterMode;
      const matchFrom= !filterFrom|| e.date >= filterFrom;
      const matchTo  = !filterTo  || e.date <= filterTo;
      return matchCat && matchQ && matchMode && matchFrom && matchTo;
    });
  }

  function stats() {
    const all = events();
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
        <div class="stat-box"><div class="num">${s.total}</div><div class="lbl">My Events</div></div>
        <div class="stat-box"><div class="num">${s.upcoming}</div><div class="lbl">Upcoming</div></div>
        <div class="stat-box"><div class="num">${s.closed}</div><div class="lbl">Closed</div></div>
        <div class="stat-box"><div class="num">${s.regs}</div><div class="lbl">Registrations</div></div>
      </div>

      <div class="tab-row" style="max-width: 400px; margin: 0 auto 30px;">
        <button class="${activeTab==='list'?'active':''}" onclick="orgTab('list')">List View</button>
        <button class="${activeTab==='calendar'?'active':''}" onclick="orgTab('calendar')">📅 Calendar</button>
      </div>

      ${activeTab === 'calendar' ? calendarHtml() : `
      <div class="filter-bar">
        <input placeholder="🔍 Search…" value="${filterQ}" oninput="orgFilter('q', this.value)" />
        <select onchange="orgFilter('cat', this.value)">
          <option value="">All Categories</option>
          ${CATEGORIES.map(c => `<option value="${c}" ${filterCat===c?'selected':''}>${c}</option>`).join('')}
        </select>
        <select onchange="orgFilter('mode', this.value)">
          <option value="">All Modes</option>
          ${MODES.map(m => `<option value="${m}" ${filterMode===m?'selected':''}>${m}</option>`).join('')}
        </select>
        <div style="display:flex;gap:8px;align-items:center;">
          <input type="date" value="${filterFrom}" onchange="orgFilter('from', this.value)" title="Start Date" />
          <span style="color:var(--text-muted)">-</span>
          <input type="date" value="${filterTo}" onchange="orgFilter('to', this.value)" title="End Date" />
        </div>
      </div>

      ${evs.length === 0 ? `<div class="empty"><div class="icon">📭</div><p>No events found.</p></div>` :
        evs.map(e => eventCard(e)).join('')}
      `}
    </div>
    ${showModal ? modalHtml() : ''}
    ${viewFeedbackId ? feedbackModalHtml() : ''}
    `;
  }

  function calendarHtml() {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const evs = events();
    
    let html = `<div class="calendar-grid">`;
    for(let i=0; i<7; i++) html += `<div class="calendar-day-header">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]}</div>`;
    
    let startDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    for(let i=0; i<startDay; i++) html += `<div class="calendar-day" style="opacity:0.2"></div>`;
    
    for(let d=1; d<=daysInMonth; d++) {
      let dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      let dayEvs = evs.filter(e => e.date === dateStr);
      let dayDeadlines = evs.filter(e => e.deadline === dateStr);
      
      let isToday = dateStr === new Date().toISOString().split('T')[0];
      html += `
        <div class="calendar-day ${isToday ? 'today' : ''}">
          <div class="date">${d}</div>
          ${dayEvs.map(e => `<div class="cal-event" onclick="orgOpenModal('${e.id}')">${e.title}</div>`).join('')}
          ${dayDeadlines.map(e => `<div class="cal-event deadline" onclick="orgOpenModal('${e.id}')">🚨 ${e.title}</div>`).join('')}
        </div>`;
    }
    html += `</div>`;
    return html;
  }

  function eventCard(e) {
    const ds = Store.deadlineStatus(e.deadline);
    const isPast = new Date(e.deadline) < new Date(new Date().toDateString());
    return `
    <div class="event-card ${isPast ? 'deadline-urgent' : ''}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
        <h3>${e.title}</h3>
        <div style="display:flex;gap:8px">
          <span class="badge badge-blue">${e.category}</span>
          <span class="badge badge-purple">${e.mode || 'Offline'}</span>
        </div>
      </div>
      <div class="meta">
        <span>📅 Event: ${e.date}</span>
        <span>⏰ Deadline: ${e.deadline}</span>
        <span>📍 ${e.venue}</span>
        <span>👥 ${e.registrations.length}/${e.maxSeats} registered</span>
        ${e.waitlist?.length ? `<span>⏳ ${e.waitlist.length} waitlisted</span>` : ''}
      </div>
      <div style="font-size:0.88rem;color:#4a5568;margin-bottom:10px;max-height:60px;overflow:hidden;text-overflow:ellipsis">
        ${e.richDescription || e.description}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span class="badge ${ds.cls}">Deadline: ${ds.label}</span>
        <div class="actions">
          <button class="btn btn-outline-light btn-sm" onclick="orgViewFeedback('${e.id}')">⭐ Feedback</button>
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
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label>Category *</label>
            <select id="m-cat">
              ${CATEGORIES.map(c => `<option value="${c}" ${(e?.category||'')=== c?'selected':''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Mode *</label>
            <select id="m-mode">
              ${MODES.map(m => `<option value="${m}" ${(e?.mode||'')=== m?'selected':''}>${m}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Description (Rich Text)</label>
          <div id="m-desc-editor" style="background:var(--surface)">${e?.richDescription || e?.description || ''}</div>
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
          <label>Venue (or Link)</label>
          <input id="m-venue" value="${e?.venue || ''}" placeholder="e.g. Main Auditorium or Zoom Link" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label>Max Seats</label>
            <input id="m-seats" type="number" value="${e?.maxSeats || 100}" min="1" />
          </div>
          <div class="form-group">
            <label>Image URL</label>
            <input id="m-img" value="${e?.imageUrl || ''}" placeholder="e.g. https://.../poster.jpg" />
          </div>
        </div>
        <div class="form-group">
          <label>YouTube Video URL</label>
          <input id="m-yt" value="${e?.youtubeUrl || ''}" placeholder="e.g. https://youtube.com/watch?v=..." />
        </div>
        <div id="modal-err" class="alert alert-error" style="display:none"></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="orgCloseModal()">Cancel</button>
          <button class="btn btn-primary" onclick="orgSave()">💾 Save</button>
        </div>
      </div>
    </div>`;
  }

  function feedbackModalHtml() {
    const fbs = Store.getEventFeedbacks(viewFeedbackId);
    return `
    <div class="modal-overlay" onclick="orgCloseModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <h3>Event Feedback</h3>
        ${fbs.length === 0 ? `<p style="color:var(--text-muted)">No feedback yet.</p>` :
          fbs.map(f => {
            const u = Store.getUsers().find(us => us.id === f.userId);
            return `
            <div class="review-card">
              <div style="display:flex;justify-content:space-between">
                <strong>${u?.name || 'Unknown'}</strong>
                <span style="color:#fbbf24">${'★'.repeat(f.rating)}${'☆'.repeat(5-f.rating)}</span>
              </div>
              <p style="margin-top:8px;font-size:0.9rem">${f.review}</p>
            </div>`;
          }).join('')
        }
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="orgCloseModal()">Close</button>
        </div>
      </div>
    </div>`;
  }

  function render() {
    document.getElementById('app').innerHTML = html();
    if (showModal && !quill) {
      setTimeout(() => {
        quill = new Quill('#m-desc-editor', {
          theme: 'snow',
          placeholder: 'Write a detailed description...',
          modules: { toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'bullet' }], ['link']] }
        });
      }, 0);
    }
  }

  // Globals
  window.orgTab = (t) => { activeTab = t; render(); };
  window.orgFilter = (key, val) => {
    if (key === 'q') filterQ = val;
    else if (key === 'cat') filterCat = val;
    else if (key === 'mode') filterMode = val;
    else if (key === 'from') filterFrom = val;
    else if (key === 'to') filterTo = val;
    render();
  };

  window.orgOpenModal = (id) => {
    editTarget = id ? Store.getEvents().find(e => e.id === id) : null;
    showModal = true;
    quill = null;
    render();
  };

  window.orgViewFeedback = (id) => {
    viewFeedbackId = id;
    render();
  };

  window.orgCloseModal = (ev) => {
    if (ev && ev.target !== document.querySelector('.modal-overlay')) return;
    showModal = false; editTarget = null; viewFeedbackId = null; quill = null; render();
  };

  window.orgDelete = (id) => {
    if (confirm('Delete this event?')) { Store.deleteEvent(id); render(); }
  };

  window.orgSave = () => {
    const title    = document.getElementById('m-title').value.trim();
    const category = document.getElementById('m-cat').value;
    const mode     = document.getElementById('m-mode').value;
    const date     = document.getElementById('m-date').value;
    const deadline = document.getElementById('m-deadline').value;
    const venue    = document.getElementById('m-venue').value.trim();
    const maxSeats = parseInt(document.getElementById('m-seats').value) || 0;
    const imageUrl = document.getElementById('m-img').value.trim();
    const youtubeUrl = document.getElementById('m-yt').value.trim();
    
    const desc     = quill ? quill.getText().trim() : '';
    const richDesc = quill ? quill.root.innerHTML : '';

    const errEl = document.getElementById('modal-err');
    if (!title || !date || !deadline) {
      errEl.textContent = 'Title, date and deadline are required.';
      errEl.style.display = 'block'; return;
    }
    if (deadline > date) {
      errEl.textContent = 'Deadline must be on or before the event date.';
      errEl.style.display = 'block'; return;
    }

    const payload = { 
      title, category, mode, date, deadline, venue, maxSeats, 
      imageUrl, youtubeUrl, description: desc, richDescription: richDesc, 
      organiser: user.name 
    };
    if (editTarget) { Store.updateEvent({ ...editTarget, ...payload }); }
    else { Store.addEvent(payload); }
    
    showModal = false; editTarget = null; quill = null; render();
  };

  render();
}
