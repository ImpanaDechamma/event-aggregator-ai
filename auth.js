// ── Auth Page ───────────────────────────────────────────────────────────────

function renderAuth() {
  let mode = 'login';   // 'login' | 'register'
  let role = 'student'; // 'student' | 'organiser'
  let error = '';

  function html() {
    return `
    <div style="display: flex; min-height: 100vh; background: var(--bg-color);">
      <!-- Left Branding Panel -->
      <div style="flex: 1; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; flex-direction: column; justify-content: center; padding: 60px; color: white; position: relative; overflow: hidden; display: none; @media(min-width: 768px) { display: flex; }">
         <div style="position: absolute; width: 600px; height: 600px; background: rgba(255,255,255,0.05); border-radius: 50%; top: -100px; left: -100px;"></div>
         <div style="position: absolute; width: 400px; height: 400px; background: rgba(255,255,255,0.05); border-radius: 50%; bottom: -50px; right: -150px;"></div>
         
         <div style="position: relative; z-index: 10; max-width: 480px; margin: 0 auto;">
           <div class="logo" style="cursor: pointer; font-size: 1.8rem; font-weight: 800; margin-bottom: 60px; letter-spacing: -0.5px;" onclick="App.navigate('landing')">EventHub</div>
           <h1 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 24px; line-height: 1.1; letter-spacing: -1px;">Your Campus,<br>One Hub.</h1>
           <p style="font-size: 1.15rem; opacity: 0.85; line-height: 1.6;">Join thousands of students and organisers discovering and managing the best college events.</p>
         </div>
      </div>
      
      <!-- Right Form Panel -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; background: var(--bg-color); position: relative;">
         
         <div style="position: absolute; top: 40px; right: 40px; font-size: 0.95rem; color: var(--text-muted);">
            ${mode === 'login' ? 'New here? <a href="#" onclick="authSetMode(\'register\'); return false;" style="color: var(--primary); text-decoration: none; font-weight: 600;">Create an account</a>' : 'Already have an account? <a href="#" onclick="authSetMode(\'login\'); return false;" style="color: var(--primary); text-decoration: none; font-weight: 600;">Sign in</a>'}
         </div>

         <div style="width: 100%; max-width: 380px;">
           <!-- Mobile Logo -->
           <div class="logo" style="cursor: pointer; font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 40px; display: block; @media(min-width: 768px) { display: none; }" onclick="App.navigate('landing')">EventHub</div>

           <h2 style="font-size: 2rem; margin-bottom: 8px; color: var(--text-main); font-weight: 700;">${mode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
           <p style="color: var(--text-muted); margin-bottom: 32px; font-size: 0.95rem;">${mode === 'login' ? 'Please enter your details to sign in.' : 'Get started with your free account.'}</p>

           ${error ? `<div class="alert alert-error" style="font-size: 0.9rem;">${error}</div>` : ''}

           ${mode === 'login' ? loginForm() : registerForm()}
         </div>
      </div>
    </div>
    <style>
      @media(max-width: 900px) {
        .landing-container > div > div:first-child { display: none !important; }
        .landing-container > div > div:last-child { flex: none; width: 100%; padding: 20px; }
      }
    </style>`;
  }

  function loginForm() {
    return `
      <div style="display: flex; background: var(--surface-hover); padding: 4px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 24px;">
        <button style="flex: 1; padding: 10px; border: none; border-radius: 6px; background: ${role === 'student' ? 'var(--primary)' : 'transparent'}; color: ${role === 'student' ? 'white' : 'var(--text-muted)'}; cursor: pointer; font-family: inherit; font-size: 0.9rem; font-weight: 600; transition: all 0.3s;" onclick="authSetRole('student')">Student</button>
        <button style="flex: 1; padding: 10px; border: none; border-radius: 6px; background: ${role === 'organiser' ? 'var(--primary)' : 'transparent'}; color: ${role === 'organiser' ? 'white' : 'var(--text-muted)'}; cursor: pointer; font-family: inherit; font-size: 0.9rem; font-weight: 600; transition: all 0.3s;" onclick="authSetRole('organiser')">Organiser</button>
      </div>

      <div class="form-group" style="margin-bottom: 20px;">
        <label style="color: var(--text-main); font-weight: 500; font-size: 0.85rem;">Email</label>
        <input id="auth-email" type="email" placeholder="name@college.edu" style="background: var(--surface); border-color: var(--border-color);" />
      </div>
      <div class="form-group" style="margin-bottom: 24px;">
        <label style="color: var(--text-main); font-weight: 500; font-size: 0.85rem;">Password</label>
        <input id="auth-pass" type="password" placeholder="••••••••" style="background: var(--surface); border-color: var(--border-color);" />
      </div>
      <button class="btn btn-primary btn-full glow-btn" style="margin-top: 8px;" onclick="authLogin()">
        Sign In
      </button>

      <div style="margin-top: 32px; position: relative; text-align: center;">
        <div style="position: absolute; top: 50%; left: 0; right: 0; border-top: 1px solid var(--border-color); z-index: 1;"></div>
        <span style="position: relative; z-index: 2; background: var(--bg-color); padding: 0 12px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Demo Access</span>
      </div>
      <div style="display: flex; gap: 12px; margin-top: 20px;">
        <button class="btn btn-outline btn-sm" style="flex: 1; border-color: var(--border-color); color: var(--text-main);" onclick="demoLogin('alice@college.edu', 'alice123', 'organiser')">Organiser</button>
        <button class="btn btn-outline btn-sm" style="flex: 1; border-color: var(--border-color); color: var(--text-main);" onclick="demoLogin('bob@college.edu', 'bob123', 'student')">Student</button>
      </div>
    `;
  }

  function registerForm() {
    return `
      <div style="display: flex; background: var(--surface-hover); padding: 4px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 24px;">
        <button style="flex: 1; padding: 10px; border: none; border-radius: 6px; background: ${role === 'student' ? 'var(--primary)' : 'transparent'}; color: ${role === 'student' ? 'white' : 'var(--text-muted)'}; cursor: pointer; font-family: inherit; font-size: 0.9rem; font-weight: 600; transition: all 0.3s;" onclick="authSetRole('student')">Student</button>
        <button style="flex: 1; padding: 10px; border: none; border-radius: 6px; background: ${role === 'organiser' ? 'var(--primary)' : 'transparent'}; color: ${role === 'organiser' ? 'white' : 'var(--text-muted)'}; cursor: pointer; font-family: inherit; font-size: 0.9rem; font-weight: 600; transition: all 0.3s;" onclick="authSetRole('organiser')">Organiser</button>
      </div>

      <div class="form-group" style="margin-bottom: 20px;">
        <label style="color: var(--text-main); font-weight: 500; font-size: 0.85rem;">Full Name</label>
        <input id="reg-name" type="text" placeholder="John Doe" style="background: var(--surface); border-color: var(--border-color);" />
      </div>
      <div class="form-group" style="margin-bottom: 20px;">
        <label style="color: var(--text-main); font-weight: 500; font-size: 0.85rem;">Email Address</label>
        <input id="reg-email" type="email" placeholder="name@college.edu" style="background: var(--surface); border-color: var(--border-color);" />
      </div>
      <div class="form-group" style="margin-bottom: 24px;">
        <label style="color: var(--text-main); font-weight: 500; font-size: 0.85rem;">Password</label>
        <input id="reg-pass" type="password" placeholder="Min 6 characters" style="background: var(--surface); border-color: var(--border-color);" />
      </div>
      <button class="btn btn-primary btn-full glow-btn" style="margin-top: 8px;" onclick="authRegister()">
        Create Account
      </button>
    `;
  }

  function render() {
    document.getElementById('app').innerHTML = html();
  }

  // Exposed globals
  window.authSetMode = (m) => { mode = m; error = ''; render(); };
  window.authSetRole = (r) => { role = r; render(); };

  window.demoLogin = (email, pass, r) => {
    role = r;
    setTimeout(() => {
      document.getElementById('auth-email').value = email;
      document.getElementById('auth-pass').value = pass;
      authLogin();
    }, 100);
  };

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
    const user = Store.registerUser(name, email, pass, role);
    Store.setSession(user);
    App.navigate(user.role === 'organiser' ? 'organiser' : 'student');
  };

  render();
}
