// ── App Router ──────────────────────────────────────────────────────────────

const App = (() => {
  function navigate(page) {
    const user = Store.getSession();
    if (page === 'organiser' && user?.role === 'organiser') { renderOrganiser(user); return; }
    if (page === 'student'   && user?.role === 'student')   { renderStudent(user);   return; }
    if (page === 'auth') { renderAuth(); return; }
    renderLanding();
  }

  function logout() {
    Store.clearSession();
    renderLanding();
  }

  function init() {
    const user = Store.getSession();
    if (user?.role === 'organiser') { renderOrganiser(user); return; }
    if (user?.role === 'student')   { renderStudent(user);   return; }
    renderLanding();
  }

  return { navigate, logout, init };
})();

App.init();
