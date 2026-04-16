// ── Auth Page ───────────────────────────────────────────────────────────────

function renderAuth() {
  let mode = 'login';   // 'login' | 'register'
  let role = 'student'; // 'student' | 'organiser'
  let error = '';

  function html() {
    return `
    <div class="auth-wrap">
      <div class="auth-box">
        <h2>🎓 EventHub</h2>
        <p>College Event Aggregator</p>

        <div class="tab-row">
          <button class="${mode === 'login'    ? 'active' : ''}" onclick="authSetMode('login')">Login</button>
          <button class="${mode === 'register' ? 'active' : ''}" onclick="authSetMode('register')">Register</button>
        </div>

        ${error ? `<div class="alert alert-error">${error}</div>` : ''}

        ${mode === 'login' ? loginForm() : registerForm()}
      </div>
    </div>`;
  }

  function loginForm() {
    return `
      <div class="role-selector">
        <div class="role-card ${role === 'student'   ? 'selected' : ''}" onclick="authSetRole('student')">
          <div class="icon">🎒</div><span>Student</span>
        </div>
        <div class="role-card ${role === 'organiser' ? 'selected' : ''}" onclick="authSetRole('organiser')">
          <div class="icon">🏫</div><span>Organiser</span>
        </div>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input id="auth-email" type="email" placeholder="you@college.edu" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input id="auth-pass" type="password" placeholder="••••••••" />
      </div>
      <button class="btn btn-primary btn-full" onclick="authLogin()">Login as ${role === 'student' ? 'Student' : 'Organiser'}</button>
    `;
  }

  function registerForm() {
    return `
      <p style="font-size:0.82rem;color:#718096;margin-bottom:14px;">Students can self-register. Organisers are added by admin.</p>
      <div class="form-group">
        <label>Full Name</label>
        <input id="reg-name" type="text" placeholder="Your name" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input id="reg-email" type="email" placeholder="you@college.edu" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input id="reg-pass" type="password" placeholder="Min 6 characters" />
      </div>
      <button class="btn btn-primary btn-full" onclick="authRegister()">Create Student Account</button>
    `;
  }

  function render() {
    document.getElementById('app').innerHTML = html();
  }

  // Exposed globals
  window.authSetMode = (m) => { mode = m; error = ''; render(); };
  window.authSetRole = (r) => { role = r; render(); };

  window.authLogin = () => {
    const email = document.getElementById('auth-email').value.trim();
    const pass  = document.getElementById('auth-pass').value;
    const user  = Store.findUser(email, pass);
    if (!user) { error = 'Invalid email or password.'; render(); return; }
    if (user.role !== role) { error = `This account is not an ${role}.`; render(); return; }
    Store.setSession(user);
    App.navigate(user.role === 'organiser' ? 'organiser' : 'student');
  };

  window.authRegister = () => {
    const name  = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass  = document.getElementById('reg-pass').value;
    if (!name || !email || !pass) { error = 'All fields are required.'; render(); return; }
    if (pass.length < 6)          { error = 'Password must be at least 6 characters.'; render(); return; }
    if (Store.emailExists(email)) { error = 'Email already registered.'; render(); return; }
    const user = Store.registerUser(name, email, pass);
    Store.setSession(user);
    App.navigate('student');
  };

  render();
}
