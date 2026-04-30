// ── Landing Page ─────────────────────────────────────────────────────────────

function renderLanding() {
  function html() {
    return `
    <div class="landing-container">
      <nav class="glass-nav">
        <div class="logo">✨ EventHub</div>
        <div class="nav-links">
          <button class="btn btn-outline btn-sm" onclick="App.navigate('auth')">Login / Register</button>
        </div>
      </nav>
      
      <main class="hero-section">
        <div class="hero-content">
          <div class="badge badge-glow" style="margin-bottom: 20px;">🚀 The Ultimate College Experience</div>
          <h1 class="hero-title">Your Campus,<br><span class="text-gradient">One Central Hub</span></h1>
          <p class="hero-subtitle">
            Discover, register, and organize college events with ease. 
            Don't miss out on the best moments of your college life. Join thousands of students already using EventHub.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg glow-btn" onclick="App.navigate('auth')">
              Explore Events <span>→</span>
            </button>
            <button class="btn btn-outline-light btn-lg" onclick="App.navigate('auth')">
              Host an Event
            </button>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="glass-card mockup-card floating-1">
            <div class="mockup-header">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <h3>🎵 CultFest 2026</h3>
            <p style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 12px;">Cultural • 📅 Oct 15</p>
            <div style="display: flex; gap: 8px;">
              <span class="badge badge-blue">150 Spots Left</span>
              <span class="badge badge-purple">Trending</span>
            </div>
          </div>
          
          <div class="glass-card mockup-card floating-2">
            <div class="mockup-header">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <h3>💻 HackTheFuture</h3>
            <p style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 12px;">Technical • 📅 Nov 02</p>
            <div style="display: flex; gap: 8px;">
              <span class="badge badge-green">Registration Open</span>
            </div>
            <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
              <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                <div style="width: 75%; height: 100%; background: var(--primary);"></div>
              </div>
              <p style="font-size: 0.75rem; margin-top: 6px; text-align: right; color: var(--text-muted);">75% Filled</p>
            </div>
          </div>
        </div>
      </main>

      <section class="features-section">
        <div style="text-align: center; max-width: 600px; margin: 0 auto;">
          <h2 class="text-gradient" style="font-size: 2.5rem; margin-bottom: 16px;">Everything you need in one place</h2>
          <p style="color: var(--text-muted); font-size: 1.1rem;">Whether you're looking to attend the biggest parties or host an academic seminar, EventHub gives you the tools to make it happen effortlessly.</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Discover Events</h3>
            <p>Find events tailored to your interests. Filter by category, date, and availability. Never miss out on what's happening around campus.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎟️</div>
            <h3>One-Click Registration</h3>
            <p>Say goodbye to long queues and confusing forms. Register for your favorite events instantly with your student profile.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Powerful Tools for Organizers</h3>
            <p>Host events, manage registrations, track capacity in real-time, and download attendee lists. Event management made simple.</p>
          </div>
        </div>
      </section>

      <footer class="landing-footer">
        <p>&copy; 2026 EventHub. Made with ❤️ for college students.</p>
      </footer>
      
      <div class="bg-elements">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>
    </div>
    `;
  }

  document.getElementById('app').innerHTML = html();
}
