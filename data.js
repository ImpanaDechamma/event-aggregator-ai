// ── Shared In-Memory Store ──────────────────────────────────────────────────

const Store = (() => {
  const USERS_KEY   = 'cea_users';
  const EVENTS_KEY  = 'cea_events';
  const SESSION_KEY = 'cea_session';

  // Seed default accounts
  function init() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify([
        { id: 'u1', name: 'Alice Organiser', email: 'alice@college.edu', password: 'alice123', role: 'organiser' },
        { id: 'u2', name: 'Bob Student',     email: 'bob@college.edu',   password: 'bob123',   role: 'student'   },
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
          maxSeats: 200, registrations: ['u2'],
        },
        {
          id: 'e2', title: 'Cultural Night', category: 'Cultural',
          description: 'Music, dance and drama performances by students.',
          date: new Date(now + 14 * 86400000).toISOString().split('T')[0],
          deadline: new Date(now + 10 * 86400000).toISOString().split('T')[0],
          venue: 'Open Air Theatre', organiser: 'Alice Organiser',
          maxSeats: 500, registrations: [],
        },
        {
          id: 'e3', title: 'Career Fair', category: 'Career',
          description: 'Top companies recruiting on campus. Bring your resume!',
          date: new Date(now + 2 * 86400000).toISOString().split('T')[0],
          deadline: new Date(now + 1 * 86400000).toISOString().split('T')[0],
          venue: 'Sports Complex', organiser: 'Alice Organiser',
          maxSeats: 300, registrations: [],
        },
      ]));
    }
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
  function registerUser(name, email, password) {
    const users = getUsers();
    const user = { id: 'u' + Date.now(), name, email, password, role: 'student' };
    users.push(user);
    saveUsers(users);
    return user;
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
      if (e.id === eventId && !e.registrations.includes(userId)) {
        return { ...e, registrations: [...e.registrations, userId] };
      }
      return e;
    });
    saveEvents(events);
  }
  function unregisterFromEvent(eventId, userId) {
    const events = getEvents().map(e => {
      if (e.id === eventId) {
        return { ...e, registrations: e.registrations.filter(id => id !== userId) };
      }
      return e;
    });
    saveEvents(events);
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
    findUser, emailExists, registerUser,
    setSession, getSession, clearSession,
    getEvents, addEvent, updateEvent, deleteEvent,
    registerForEvent, unregisterFromEvent,
    daysUntil, deadlineStatus,
  };
})();
