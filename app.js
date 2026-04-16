// ── App Router ──────────────────────────────────────────────────────────────

const App = (() => {
  function navigate(page) {
    const user = Store.getSession();
    if (page === 'organiser' && user?.role === 'organiser') { renderOrganiser(user); return; }
    if (page === 'student'   && user?.role === 'student')   { renderStudent(user);   return; }
    renderAuth();
  }

  function logout() {
    Store.clearSession();
    renderAuth();
  }

  function init() {
    const user = Store.getSession();
    if (user?.role === 'organiser') { renderOrganiser(user); return; }
    if (user?.role === 'student')   { renderStudent(user);   return; }
    renderAuth();
  }

  return { navigate, logout, init };
})();

App.init();
