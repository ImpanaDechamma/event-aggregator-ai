// ── Student Dashboard ───────────────────────────────────────────────────────

function renderStudent(user) {
  let activeTab = 'all'; // 'all', 'registered', 'deadlines', 'teams', 'profile', 'calendar'
  let filterCat = '';
  let filterQ   = '';
  let filterMode = '';
  let filterFrom = '';
  let filterTo = '';
  let reviewTargetId = null;

  const CATEGORIES = ['Technical', 'Cultural', 'Career', 'Sports', 'Workshop', 'Other'];
  const MODES = ['Offline', 'Online', 'Hybrid'];

  function allEvents() { return Store.getEvents(); }
  function myEvents()  { return allEvents().filter(e => e.registrations.includes(user.id) || (e.waitlist && e.waitlist.includes(user.id))); }

  function filteredEvents() {
    let list = activeTab === 'registered' ? myEvents() : allEvents();
    if (activeTab === 'deadlines') {
      list = myEvents()
        .filter(e => Store.daysUntil(e.deadline) >= 0)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
    if (filterCat) list = list.filter(e => e.category === filterCat);
    if (filterQ)   list = list.filter(e => e.title.toLowerCase().includes(filterQ.toLowerCase()));
    if (filterMode) list = list.filter(e => e.mode === filterMode);
    if (filterFrom) list = list.filter(e => e.date >= filterFrom);
    if (filterTo)   list = list.filter(e => e.date <= filterTo);
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
    const avatarTxt = user.avatar ? `<img src="${user.avatar}" class="avatar" style="width:30px;height:30px">` : `<div class="avatar" style="width:30px;height:30px">${user.name[0]}</div>`;
    
    return `
    <nav>
      <h1>🎓 EventHub — Student</h1>
      <div style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="stuTab('profile')">
        ${avatarTxt}
        <span style="font-size:0.88rem">👤 ${user.name}</span>
        <button onclick="event.stopPropagation(); App.logout()">Logout</button>
      </div>
    </nav>
    <div class="container">
      <div class="stats-row">
        <div class="stat-box"><div class="num">${s.total}</div><div class="lbl">Upcoming Events</div></div>
        <div class="stat-box"><div class="num">${s.mine}</div><div class="lbl">Registered</div></div>
        <div class="stat-box"><div class="num" style="color:${s.urgent>0?'var(--danger)':'var(--text-main)'}">${s.urgent}</div><div class="lbl">Urgent Deadlines</div></div>
      </div>

      <div class="tab-row" style="margin-bottom:30px; flex-wrap:wrap; gap:4px">
        <button class="${activeTab==='all'        ? 'active':''}" onclick="stuTab('all')">All Events</button>
        <button class="${activeTab==='registered' ? 'active':''}" onclick="stuTab('registered')">My Registrations</button>
        <button class="${activeTab==='deadlines'  ? 'active':''}" onclick="stuTab('deadlines')">⏰ Deadlines</button>
        <button class="${activeTab==='calendar'   ? 'active':''}" onclick="stuTab('calendar')">📅 Calendar</button>
        <button class="${activeTab==='teams'      ? 'active':''}" onclick="stuTab('teams')">👥 Teams</button>
        <button class="${activeTab==='profile'    ? 'active':''}" onclick="stuTab('profile')">👤 Profile</button>
      </div>

      ${renderTabContent(evs)}
    </div>
    ${reviewTargetId ? reviewModalHtml() : ''}
    `;
  }

  function renderTabContent(evs) {
    if (activeTab === 'profile') return profileHtml();
    if (activeTab === 'teams') return teamsHtml();
    if (activeTab === 'calendar') return calendarHtml();
    
    let filterBar = '';
    if (activeTab !== 'deadlines') {
      filterBar = `
      <div class="filter-bar">
        <input placeholder="🔍 Search events…" value="${filterQ}" oninput="stuFilter('q', this.value)" />
        <select onchange="stuFilter('cat', this.value)">
          <option value="">All Categories</option>
          ${CATEGORIES.map(c => `<option value="${c}" ${filterCat===c?'selected':''}>${c}</option>`).join('')}
        </select>
        <select onchange="stuFilter('mode', this.value)">
          <option value="">All Modes</option>
          ${MODES.map(m => `<option value="${m}" ${filterMode===m?'selected':''}>${m}</option>`).join('')}
        </select>
        <div style="display:flex;gap:8px;align-items:center;">
          <input type="date" value="${filterFrom}" onchange="stuFilter('from', this.value)" title="Start Date" />
          <span style="color:var(--text-muted)">-</span>
          <input type="date" value="${filterTo}" onchange="stuFilter('to', this.value)" title="End Date" />
        </div>
      </div>`;
    }

    let listHtml = activeTab === 'deadlines' ? deadlineView() :
      (evs.length === 0 ? `<div class="empty"><div class="icon">📭</div><p>No events found.</p></div>` : evs.map(e => eventCard(e)).join(''));

    return filterBar + listHtml;
  }

  function profileHtml() {
    return `
    <div class="card" style="max-width:500px;margin:0 auto">
      <h2>Your Profile</h2>
      <div style="display:flex;justify-content:center;margin:20px 0">
        ${user.avatar ? `<img src="${user.avatar}" class="avatar-lg" style="border-radius:50%;object-fit:cover">` : `<div class="avatar avatar-lg">${user.name[0]}</div>`}
      </div>
      <div class="form-group">
        <label>Name</label>
        <input id="p-name" value="${user.name}" />
      </div>
      <div class="form-group">
        <label>Avatar URL</label>
        <input id="p-avatar" value="${user.avatar || ''}" placeholder="https://..." />
      </div>
      <div class="form-group">
        <label>Department / Major</label>
        <input id="p-dept" value="${user.department || ''}" placeholder="e.g. Computer Science" />
      </div>
      <div class="form-group">
        <label>GitHub Profile</label>
        <input id="p-git" value="${user.github || ''}" placeholder="https://github.com/..." />
      </div>
      <div class="form-group">
        <label>LinkedIn Profile</label>
        <input id="p-in" value="${user.linkedin || ''}" placeholder="https://linkedin.com/in/..." />
      </div>
      <button class="btn btn-primary btn-full" onclick="stuSaveProfile()">Save Profile</button>
    </div>`;
  }

  function teamsHtml() {
    const myTeams = Store.getUserTeams(user.id);
    return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px">
      <div class="card">
        <h3>Create a New Team</h3>
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px">Create a team and share the code to let friends join.</p>
        <div class="form-group">
          <input id="t-name" placeholder="Team Name..." />
        </div>
        <button class="btn btn-primary" onclick="stuCreateTeam()">Create Team</button>
      </div>
      <div class="card">
        <h3>Join a Team</h3>
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px">Have an invite code? Join an existing team.</p>
        <div class="form-group">
          <input id="t-code" placeholder="Invite Code (e.g. A1B2C)" />
        </div>
        <button class="btn btn-outline" onclick="stuJoinTeam()">Join Team</button>
      </div>
    </div>
    <div class="section-title" style="margin-top:30px">My Teams</div>
    ${myTeams.length === 0 ? '<div class="empty"><p>You are not in any teams yet.</p></div>' : 
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' + myTeams.map(t => {
        const members = t.members.map(mid => Store.getUsers().find(u=>u.id===mid)?.name || 'Unknown');
        return `
        <div class="team-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <strong style="font-size:1.2rem">${t.name}</strong>
            <span class="team-code">${t.code}</span>
          </div>
          <p style="font-size:0.9rem;color:var(--text-muted)">Members: ${members.join(', ')}</p>
        </div>`;
      }).join('') + '</div>'
    }`;
  }

  function calendarHtml() {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const evs = allEvents();
    
    let html = `<div class="calendar-grid">`;
    for(let i=0; i<7; i++) html += `<div class="calendar-day-header">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]}</div>`;
    let startDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    for(let i=0; i<startDay; i++) html += `<div class="calendar-day" style="opacity:0.2"></div>`;
    
    for(let d=1; d<=daysInMonth; d++) {
      let dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      let dayEvs = evs.filter(e => e.date === dateStr);
      let dayDeadlines = myEvents().filter(e => e.deadline === dateStr);
      let isToday = dateStr === new Date().toISOString().split('T')[0];
      
      html += `<div class="calendar-day ${isToday ? 'today' : ''}">
          <div class="date">${d}</div>
          ${dayEvs.map(e => `<div class="cal-event">${e.title}</div>`).join('')}
          ${dayDeadlines.map(e => `<div class="cal-event deadline">🚨 Deadline: ${e.title}</div>`).join('')}
        </div>`;
    }
    html += `</div>`;
    return html;
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
    const isWaitlist = e.waitlist?.includes(user.id);
    const isClosed   = Store.daysUntil(e.deadline) < 0;
    const isFull     = e.registrations.length >= e.maxSeats;
    const spotsLeft  = e.maxSeats - e.registrations.length;
    const isPast     = new Date(e.date) < new Date(new Date().toDateString());

    let actionBtn = '';
    if (isReg) {
      actionBtn = `
        <span class="registered-tag">✅ Registered</span>
        <button class="btn btn-outline btn-sm" onclick="stuUnregister('${e.id}')">Unregister</button>`;
    } else if (isWaitlist) {
      actionBtn = `
        <span class="registered-tag" style="color:#fbbf24">⏳ Waitlisted</span>
        <button class="btn btn-outline btn-sm" onclick="stuUnregister('${e.id}')">Leave Waitlist</button>`;
    } else if (isClosed) {
      actionBtn = `<span class="badge badge-red">Registration Closed</span>`;
    } else if (isFull) {
      actionBtn = `<button class="btn btn-warning btn-sm" style="background:#f59e0b;color:#fff;border:none" onclick="stuRegister('${e.id}')">Join Waitlist</button>`;
    } else {
      actionBtn = `<button class="btn btn-success btn-sm" onclick="stuRegister('${e.id}')">Register Now</button>`;
    }

    if (isPast && isReg) {
      const existing = Store.getEventFeedbacks(e.id).find(f => f.userId === user.id);
      if (existing) {
        actionBtn += ` <span class="badge badge-glow">⭐ Rated ${existing.rating}/5</span>`;
      } else {
        actionBtn += ` <button class="btn btn-outline-light btn-sm" onclick="stuOpenReview('${e.id}')">⭐ Leave Review</button>`;
      }
    }

    const imgHtml = e.imageUrl ? `<img src="${e.imageUrl}" style="width:100%;height:150px;object-fit:cover;border-radius:var(--radius-sm);margin-bottom:16px">` : '';

    return `
    <div class="event-card">
      ${imgHtml}
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
        <h3>${e.title}</h3>
        <div style="display:flex;gap:8px">
          <span class="badge badge-blue">${e.category}</span>
          <span class="badge badge-purple">${e.mode || 'Offline'}</span>
        </div>
      </div>
      <div class="meta">
        <span>📅 ${e.date}</span>
        <span>⏰ Deadline: ${e.deadline}</span>
        <span>📍 ${e.venue}</span>
        <span>👥 ${spotsLeft > 0 ? spotsLeft + ' spots left' : 'Full'}</span>
        <span>🏫 ${e.organiser}</span>
      </div>
      <div style="font-size:0.88rem;color:#4a5568;margin-bottom:10px;max-height:80px;overflow-y:auto">
        ${e.richDescription || e.description}
      </div>
      ${e.youtubeUrl ? `<a href="${e.youtubeUrl}" target="_blank" style="color:var(--info);font-size:0.9rem;display:inline-block;margin-bottom:10px">▶️ Watch Promo</a>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:10px">
        <span class="badge ${ds.cls}">Deadline: ${ds.label}</span>
        <div class="actions">${actionBtn}</div>
      </div>
    </div>`;
  }

  function reviewModalHtml() {
    return `
    <div class="modal-overlay" onclick="stuCloseReview(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <h3>Leave a Review</h3>
        <div class="form-group" style="text-align:center">
          <label>Rating</label>
          <div class="star-rating" id="r-stars">
            <span class="star" onclick="stuSetStar(1)">★</span>
            <span class="star" onclick="stuSetStar(2)">★</span>
            <span class="star" onclick="stuSetStar(3)">★</span>
            <span class="star" onclick="stuSetStar(4)">★</span>
            <span class="star" onclick="stuSetStar(5)">★</span>
          </div>
        </div>
        <div class="form-group">
          <label>Review Comment</label>
          <textarea id="r-text" placeholder="What did you think of the event?"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="stuCloseReview()">Cancel</button>
          <button class="btn btn-primary" onclick="stuSubmitReview()">Submit</button>
        </div>
      </div>
    </div>`;
  }

  function render() { document.getElementById('app').innerHTML = html(); }

  // Globals
  window.stuTab = (t) => { activeTab = t; filterCat = ''; filterQ = ''; filterMode = ''; filterFrom = ''; filterTo = ''; render(); };
  window.stuFilter = (key, val) => {
    if (key === 'q') filterQ = val;
    else if (key === 'cat') filterCat = val;
    else if (key === 'mode') filterMode = val;
    else if (key === 'from') filterFrom = val;
    else if (key === 'to') filterTo = val;
    render();
  };
  window.stuRegister = (id) => { Store.registerForEvent(id, user.id); render(); };
  window.stuUnregister = (id) => {
    if (confirm('Unregister from this event?')) { Store.unregisterFromEvent(id, user.id); render(); }
  };

  // Profile
  window.stuSaveProfile = () => {
    const name = document.getElementById('p-name').value.trim();
    const avatar = document.getElementById('p-avatar').value.trim();
    const dept = document.getElementById('p-dept').value.trim();
    const git = document.getElementById('p-git').value.trim();
    const linked = document.getElementById('p-in').value.trim();
    if(name) {
      user.name = name; user.avatar = avatar; user.department = dept; user.github = git; user.linkedin = linked;
      Store.updateUser(user);
      render();
    }
  };

  // Teams
  window.stuCreateTeam = () => {
    const name = document.getElementById('t-name').value.trim();
    if (name) {
      Store.createTeam(name, user.id);
      render();
    }
  };
  window.stuJoinTeam = () => {
    const code = document.getElementById('t-code').value.trim().toUpperCase();
    if (code) {
      const t = Store.joinTeam(code, user.id);
      if(!t) alert('Invalid code or already joined.');
      render();
    }
  };

  // Feedback
  let currentRating = 5;
  window.stuOpenReview = (id) => { reviewTargetId = id; currentRating = 5; render(); setTimeout(()=>stuSetStar(5), 10); };
  window.stuCloseReview = (ev) => {
    if (ev && ev.target !== document.querySelector('.modal-overlay')) return;
    reviewTargetId = null; render();
  };
  window.stuSetStar = (n) => {
    currentRating = n;
    const stars = document.querySelectorAll('#r-stars .star');
    stars.forEach((s, i) => {
      s.style.color = i < n ? '#fbbf24' : 'var(--text-muted)';
    });
  };
  window.stuSubmitReview = () => {
    const text = document.getElementById('r-text').value.trim();
    if (text) {
      Store.addFeedback(reviewTargetId, user.id, currentRating, text);
      reviewTargetId = null;
      render();
    } else {
      alert("Please provide a comment.");
    }
  };

  render();
}
