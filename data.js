// ── Shared In-Memory Store ──────────────────────────────────────────────────

const Store = (() => {
  const USERS_KEY   = 'cea_users';
  const EVENTS_KEY  = 'cea_events';
  const SESSION_KEY = 'cea_session';

  const FEEDBACKS_KEY = 'cea_feedbacks';
  const TEAMS_KEY     = 'cea_teams';

  // Seed default accounts
  function init() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify([
        { id: 'u1', name: 'Alice Organiser', email: 'alice@college.edu', password: 'alice123', role: 'organiser', avatar: '', department: 'CS', github: '', linkedin: '' },
        { id: 'u2', name: 'Bob Student',     email: 'bob@college.edu',   password: 'bob123',   role: 'student',   avatar: '', department: 'IT', github: '', linkedin: '' },
      ]));
    }
    if (!localStorage.getItem(EVENTS_KEY)) {
      const now = Date.now();
      localStorage.setItem(EVENTS_KEY, JSON.stringify([
        {
          id: 'e1', title: 'Tech Fest 2025', category: 'Technical',
          description: 'Annual technical festival with hackathons, coding contests and robotics.',
          date: new Date(now + 7 * 86400000).toISOString().split('T')[0],
          deadline: new Date(now + 3 * 86400000).toISOString().split('T')[0],
          venue: 'Main Auditorium', organiser: 'Alice Organiser',
          maxSeats: 200, registrations: ['u2'], waitlist: [],
          mode: 'Offline', imageUrl: '', youtubeUrl: '', richDescription: 'Annual technical festival with hackathons, coding contests and robotics.'
        },
        {
          id: 'e2', title: 'Cultural Night', category: 'Cultural',
          description: 'Music, dance and drama performances by students.',
          date: new Date(now + 14 * 86400000).toISOString().split('T')[0],
          deadline: new Date(now + 10 * 86400000).toISOString().split('T')[0],
          venue: 'Open Air Theatre', organiser: 'Alice Organiser',
          maxSeats: 500, registrations: [], waitlist: [],
          mode: 'Offline', imageUrl: '', youtubeUrl: '', richDescription: 'Music, dance and drama performances by students.'
        },
        {
          id: 'e3', title: 'Career Fair', category: 'Career',
          description: 'Top companies recruiting on campus. Bring your resume!',
          date: new Date(now + 2 * 86400000).toISOString().split('T')[0],
          deadline: new Date(now + 1 * 86400000).toISOString().split('T')[0],
          venue: 'Sports Complex', organiser: 'Alice Organiser',
          maxSeats: 300, registrations: [], waitlist: [],
          mode: 'Offline', imageUrl: '', youtubeUrl: '', richDescription: 'Top companies recruiting on campus. Bring your resume!'
        },
      ]));
    }
    if (!localStorage.getItem(FEEDBACKS_KEY)) localStorage.setItem(FEEDBACKS_KEY, '[]');
    if (!localStorage.getItem(TEAMS_KEY))     localStorage.setItem(TEAMS_KEY, '[]');
  }

  // Users
  function getUsers()  { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

  function findUser(email, password) {
    return getUsers().find(u => u.email === email && u.password === password) || null;
  }
  function emailExists(email) {
    return getUsers().some(u => u.email === email);
  }
  function registerUser(name, email, password, role = 'student') {
    const users = getUsers();
    const user = { id: 'u' + Date.now(), name, email, password, role, avatar: '', department: '', github: '', linkedin: '' };
    users.push(user);
    saveUsers(users);
    return user;
  }
  function updateUser(updated) {
    const users = getUsers().map(u => u.id === updated.id ? { ...u, ...updated } : u);
    saveUsers(users);
    if (getSession()?.id === updated.id) setSession(updated);
  }

  // Session
  function setSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
  function getSession()     { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  function clearSession()   { localStorage.removeItem(SESSION_KEY); }

  // Events
  function getEvents()   { return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]'); }
  function saveEvents(e) { localStorage.setItem(EVENTS_KEY, JSON.stringify(e)); }

  function addEvent(ev) {
    const events = getEvents();
    ev.id = 'e' + Date.now();
    ev.registrations = [];
    ev.waitlist = [];
    events.push(ev);
    saveEvents(events);
    return ev;
  }
  function updateEvent(updated) {
    const events = getEvents().map(e => e.id === updated.id ? { ...e, ...updated } : e);
    saveEvents(events);
  }
  function deleteEvent(id) {
    saveEvents(getEvents().filter(e => e.id !== id));
  }
  function registerForEvent(eventId, userId) {
    const events = getEvents().map(e => {
      if (e.id === eventId) {
        if (!e.registrations.includes(userId) && (!e.waitlist || !e.waitlist.includes(userId))) {
          if (e.registrations.length >= e.maxSeats) {
            return { ...e, waitlist: [...(e.waitlist || []), userId] };
          }
          return { ...e, registrations: [...e.registrations, userId] };
        }
      }
      return e;
    });
    saveEvents(events);
  }
  function unregisterFromEvent(eventId, userId) {
    const events = getEvents().map(e => {
      if (e.id === eventId) {
        let regs = e.registrations.filter(id => id !== userId);
        let wl = (e.waitlist || []).filter(id => id !== userId);
        if (e.registrations.includes(userId) && wl.length > 0 && regs.length < e.maxSeats) {
          regs.push(wl.shift());
        }
        return { ...e, registrations: regs, waitlist: wl };
      }
      return e;
    });
    saveEvents(events);
  }

  // Teams
  function getTeams() { return JSON.parse(localStorage.getItem(TEAMS_KEY) || '[]'); }
  function saveTeams(t) { localStorage.setItem(TEAMS_KEY, JSON.stringify(t)); }
  function createTeam(name, ownerId) {
    const teams = getTeams();
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const team = { id: 't' + Date.now(), name, code, members: [ownerId] };
    teams.push(team);
    saveTeams(teams);
    return team;
  }
  function joinTeam(code, userId) {
    const teams = getTeams();
    const team = teams.find(t => t.code === code);
    if (team && !team.members.includes(userId)) {
      team.members.push(userId);
      saveTeams(teams);
      return team;
    }
    return null;
  }
  function getUserTeams(userId) {
    return getTeams().filter(t => t.members.includes(userId));
  }

  // Feedbacks
  function getFeedbacks() { return JSON.parse(localStorage.getItem(FEEDBACKS_KEY) || '[]'); }
  function saveFeedbacks(f) { localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(f)); }
  function addFeedback(eventId, userId, rating, review) {
    const f = getFeedbacks();
    f.push({ id: 'f' + Date.now(), eventId, userId, rating, review, date: new Date().toISOString() });
    saveFeedbacks(f);
  }
  function getEventFeedbacks(eventId) {
    return getFeedbacks().filter(f => f.eventId === eventId);
  }

  // Deadline helpers
  function daysUntil(dateStr) {
    const diff = new Date(dateStr) - new Date(new Date().toDateString());
    return Math.ceil(diff / 86400000);
  }
  function deadlineStatus(dateStr) {
    const d = daysUntil(dateStr);
    if (d < 0)  return { label: 'Closed',   cls: 'badge-red'    };
    if (d === 0) return { label: 'Today!',   cls: 'badge-red'    };
    if (d <= 2)  return { label: `${d}d left`, cls: 'badge-red'  };
    if (d <= 5)  return { label: `${d}d left`, cls: 'badge-yellow'};
    return           { label: `${d}d left`, cls: 'badge-green'  };
  }

  init();
  return {
    findUser, emailExists, registerUser, updateUser,
    setSession, getSession, clearSession,
    getEvents, addEvent, updateEvent, deleteEvent,
    registerForEvent, unregisterFromEvent,
    daysUntil, deadlineStatus,
    getTeams, createTeam, joinTeam, getUserTeams,
    getFeedbacks, addFeedback, getEventFeedbacks,
    getUsers
  };
})();
