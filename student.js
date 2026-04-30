// ── Student Dashboard ───────────────────────────────────────────────────────

function renderStudent(user) {
  let activeTab = 'all';   // 'all' | 'registered' | 'deadlines'
  let filterCat = '';
  let filterQ   = '';

  const CATEGORIES = ['Technical', 'Cultural', 'Career', 'Sports', 'Workshop', 'Other'];

  function allEvents() { return Store.getEvents(); }
  function myEvents()  { return allEvents().filter(e => e.registrations.includes(user.id)); }

  function filteredEvents() {
    let list = activeTab === 'registered' ? myEvents() : allEvents();
    if (activeTab === 'deadlines') {
      list = myEvents()
        .filter(e => Store.daysUntil(e.deadline) >= 0)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
    if (filterCat) list = list.filter(e => e.category === filterCat);
    if (filterQ)   list = list.filter(e => e.title.toLowerCase().includes(filterQ.toLowerCase()));
    return list;
  }

  function stats() {
    const now = new Date().toISOString().split('T')[0];
    const my  = myEvents();
    const urgent = my.filter(e => {
      const d = Store.daysUntil(e.deadline);
      return d >= 0 && d <= 3;
    });
    return {
      total:    allEvents().filter(e => e.date >= now).length,
      mine:     my.length,
      urgent:   urgent.length,
    };
  }

  function html() {
    const s   = stats();
    const evs = filteredEvents();
    return `
    <nav>
      <h1>🎓 EventHub — Student</h1>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:0.88rem">👤 ${user.name}</span>
        <button onclick="App.logout()">Logout</button>
      </div>
    </nav>
    <div class="container">
      <div class="stats-row">
        <div class="stat-box"><div class="num">${s.total}</div><div class="lbl">Upcoming Events</div></div>
        <div class="stat-box"><div class="num">${s.mine}</div><div class="lbl">Registered</div></div>
        <div class="stat-box"><div class="num" style="color:${s.urgent>0?'var(--danger)':'var(--text-main)'}">${s.urgent}</div><div class="lbl">Urgent Deadlines</div></div>
      </div>

      <div class="tab-row" style="margin-bottom:30px; max-width: 600px; margin-left: auto; margin-right: auto;">
        <button class="${activeTab==='all'        ? 'active':''}" onclick="stuTab('all')">All Events</button>
        <button class="${activeTab==='registered' ? 'active':''}" onclick="stuTab('registered')">My Registrations</button>
        <button class="${activeTab==='deadlines'  ? 'active':''}" onclick="stuTab('deadlines')">⏰ Deadlines</button>
      </div>

      ${activeTab !== 'deadlines' ? `
      <div class="filter-bar">
        <input placeholder="🔍 Search events…" value="${filterQ}" oninput="stuFilter('q', this.value)" />
        <select onchange="stuFilter('cat', this.value)">
          <option value="">All Categories</option>
          ${CATEGORIES.map(c => `<option value="${c}" ${filterCat===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>` : ''}

      ${activeTab === 'deadlines' ? deadlineView() :
        evs.length === 0
          ? `<div class="empty"><div class="icon">📭</div><p>No events found.</p></div>`
          : evs.map(e => eventCard(e)).join('')}
    </div>`;
  }

  function deadlineView() {
    const evs = filteredEvents();
    if (evs.length === 0) return `<div class="empty"><div class="icon">✅</div><p>No upcoming deadlines for your registered events.</p></div>`;
    return `
      <div class="section-title">Upcoming Deadlines (events you're registered for)</div>
      ${evs.map(e => {
        const ds = Store.deadlineStatus(e.deadline);
        const d  = Store.daysUntil(e.deadline);
        return `
        <div class="event-card ${d <= 2 ? 'deadline-urgent' : d <= 5 ? 'deadline-soon' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
            <h3>${e.title}</h3>
            <span class="badge ${ds.cls}">⏰ ${ds.label}</span>
          </div>
          <div class="meta">
            <span>📅 Event: ${e.date}</span>
            <span>⏰ Deadline: ${e.deadline}</span>
            <span>📍 ${e.venue}</span>
            <span class="badge badge-blue">${e.category}</span>
          </div>
          ${d <= 2 ? `<p style="color:#c53030;font-size:0.85rem;font-weight:600">⚠️ Registration deadline is very soon!</p>` : ''}
        </div>`;
      }).join('')}`;
  }

  function eventCard(e) {
    const ds         = Store.deadlineStatus(e.deadline);
    const isReg      = e.registrations.includes(user.id);
    const isClosed   = Store.daysUntil(e.deadline) < 0;
    const isFull     = e.registrations.length >= e.maxSeats;
    const spotsLeft  = e.maxSeats - e.registrations.length;

    let actionBtn = '';
    if (isReg) {
      actionBtn = `
        <span class="registered-tag">✅ Registered</span>
        <button class="btn btn-outline btn-sm" onclick="stuUnregister('${e.id}')">Unregister</button>`;
    } else if (isClosed) {
      actionBtn = `<span class="badge badge-red">Registration Closed</span>`;
    } else if (isFull) {
      actionBtn = `<span class="badge badge-red">Full</span>`;
    } else {
      actionBtn = `<button class="btn btn-success btn-sm" onclick="stuRegister('${e.id}')">Register Now</button>`;
    }

    return `
    <div class="event-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
        <h3>${e.title}</h3>
        <span class="badge badge-blue">${e.category}</span>
      </div>
      <div class="meta">
        <span>📅 ${e.date}</span>
        <span>⏰ Deadline: ${e.deadline}</span>
        <span>📍 ${e.venue}</span>
        <span>👥 ${spotsLeft} spots left</span>
        <span>🏫 ${e.organiser}</span>
      </div>
      <p style="font-size:0.88rem;color:#4a5568;margin-bottom:10px">${e.description}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span class="badge ${ds.cls}">Deadline: ${ds.label}</span>
        <div class="actions">${actionBtn}</div>
      </div>
    </div>`;
  }

  function render() { document.getElementById('app').innerHTML = html(); }

  // Globals
  window.stuTab = (t) => { activeTab = t; filterCat = ''; filterQ = ''; render(); };
  window.stuFilter = (key, val) => {
    if (key === 'q') filterQ = val; else filterCat = val;
    render();
  };
  window.stuRegister = (id) => {
    Store.registerForEvent(id, user.id);
    render();
  };
  window.stuUnregister = (id) => {
    if (confirm('Unregister from this event?')) { Store.unregisterFromEvent(id, user.id); render(); }
  };

  render();
}
