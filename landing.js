// ── Landing Page ─────────────────────────────────────────────────────────────

function renderLanding() {
  function html() {
    return `
    <div class="landing-container" style="background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
      <nav class="glass-nav" style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); box-shadow: var(--shadow-subtle);">
        <div class="logo" style="display: flex; align-items: center; gap: 10px;">
          <span style="background: var(--primary); color: white; padding: 6px; border-radius: 8px; font-size: 1.2rem;">✨</span>
          <span style="font-size: 1.6rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px;">EventHub</span>
        </div>
        <div class="nav-links" style="display: flex; align-items: center; gap: 24px;">
          <a href="#" style="color: var(--text-muted); text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: color 0.3s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Discover</a>
          <a href="#" style="color: var(--text-muted); text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: color 0.3s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Categories</a>
          <button class="btn btn-primary btn-sm" style="border-radius: var(--radius-xl); padding: 8px 24px;" onclick="App.navigate('auth')">Join Now</button>
        </div>
      </nav>
      
      <main class="hero-section" style="padding: 120px 8% 80px; align-items: center; min-height: 90vh;">
        <div class="hero-content" style="z-index: 2;">
          <div style="display: inline-flex; align-items: center; gap: 10px; background: var(--secondary-glow); padding: 8px 20px; border-radius: 100px; margin-bottom: 24px; border: 1px solid rgba(124, 58, 237, 0.1);">
            <span style="font-size: 0.9rem; font-weight: 600; color: var(--secondary);">🚀 2,000+ Events This Semester</span>
          </div>
          <h1 class="hero-title" style="font-size: 4.5rem; color: var(--text-main); margin-bottom: 24px; line-height: 1.05;">
            Find and Manage<br>
            <span style="background: linear-gradient(90deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">College Events</span>
          </h1>
          <p class="hero-subtitle" style="font-size: 1.25rem; color: var(--text-muted); max-width: 540px; margin-bottom: 48px; line-height: 1.6;">
            Elevate your campus life with the go-to platform for discovering hackathons, festivals, and workshops. Professional tools for every student and organizer.
          </p>
          <div class="hero-actions" style="display: flex; gap: 20px;">
            <button class="btn btn-primary btn-lg" style="border-radius: var(--radius-xl); padding: 18px 40px; font-size: 1.1rem;" onclick="App.navigate('auth')">
              Explore Events <span style="margin-left: 8px; font-size: 1.2rem;">→</span>
            </button>
            <button class="btn btn-outline btn-lg" style="border-radius: var(--radius-xl); padding: 18px 40px; font-size: 1.1rem; border: 2px solid var(--border-color);" onclick="App.navigate('auth')">
              Host an Event
            </button>
          </div>
          
          <div style="margin-top: 60px; display: flex; gap: 40px; border-top: 1px solid var(--border-color); padding-top: 40px;">
            <div>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-main);">50+</div>
              <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">Campus Chapters</div>
            </div>
            <div>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-main);">12k</div>
              <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">Active Students</div>
            </div>
            <div>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-main);">4.9/5</div>
              <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">User Rating</div>
            </div>
          </div>
        </div>
        
        <div class="hero-visual" style="flex: 1.2; position: relative; display: flex; justify-content: flex-end; z-index: 1;">
          <div style="position: relative; width: 100%; max-width: 700px; animation: float 6s ease-in-out infinite;">
            <img src="college_events_hero_graphic_1778127450579.png" style="width: 100%; height: auto; border-radius: var(--radius-lg); filter: drop-shadow(0 30px 60px rgba(0,0,0,0.1));" alt="College Events Illustration">
            
            <!-- Dynamic Floating Cards -->
            <div class="event-card" style="position: absolute; top: -40px; left: -20px; width: 280px; padding: 20px; z-index: 3; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3 style="font-size: 1.1rem; margin: 0;">🎵 CultFest 2026</h3>
                <span class="badge" style="background: var(--secondary-glow); color: var(--secondary); font-size: 0.7rem; padding: 4px 10px; border-radius: 100px;">TRENDING</span>
              </div>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 10px 0;">Cultural • 📅 Oct 15</p>
              <div style="height: 6px; background: #eef2ff; border-radius: 4px; overflow: hidden; margin-top: 15px;">
                <div style="width: 85%; height: 100%; background: var(--primary); animation: progressPulse 2s infinite;"></div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">85% Filled</span>
                <span style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">12 Spots Left</span>
              </div>
            </div>

            <div class="event-card" style="position: absolute; bottom: -20px; right: 20px; width: 280px; padding: 20px; z-index: 3; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3 style="font-size: 1.1rem; margin: 0;">💻 HackTheFuture</h3>
                <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 0.7rem; padding: 4px 10px; border-radius: 100px;">LIVE</span>
              </div>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 10px 0;">Technical • 📅 Nov 02</p>
              <div style="height: 6px; background: #eef2ff; border-radius: 4px; overflow: hidden; margin-top: 15px;">
                <div style="width: 45%; height: 100%; background: #10b981;"></div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">45% Filled</span>
                <span style="font-size: 0.75rem; color: #10b981; font-weight: 600;">Registration Open</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section class="features-section" style="padding: 100px 8%; background: var(--surface-subtle);">
        <div style="text-align: center; max-width: 800px; margin: 0 auto 80px;">
          <h2 style="font-size: 3rem; color: var(--text-main); margin-bottom: 24px; letter-spacing: -1px;">Everything you need to <span style="color: var(--primary)">level up</span></h2>
          <p style="color: var(--text-muted); font-size: 1.2rem; line-height: 1.6;">Whether you're looking to attend the biggest parties or host an academic seminar, EventHub gives you the tools to make it happen effortlessly.</p>
        </div>
        
        <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px;">
          <div class="feature-card" style="border-radius: var(--radius-lg);">
            <div class="feature-icon" style="background: var(--primary-glow); color: var(--primary); border-radius: 16px; margin-bottom: 30px;">🎯</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Discover Events</h3>
            <p style="font-size: 1.05rem; line-height: 1.7;">Find events tailored to your interests. Filter by category, date, and availability. Never miss out on what's happening around campus.</p>
          </div>
          <div class="feature-card" style="border-radius: var(--radius-lg);">
            <div class="feature-icon" style="background: var(--secondary-glow); color: var(--secondary); border-radius: 16px; margin-bottom: 30px;">🎟️</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 16px;">One-Click Registration</h3>
            <p style="font-size: 1.05rem; line-height: 1.7;">Say goodbye to long queues and confusing forms. Register for your favorite events instantly with your student profile.</p>
          </div>
          <div class="feature-card" style="border-radius: var(--radius-lg);">
            <div class="feature-icon" style="background: rgba(14, 165, 233, 0.1); color: var(--accent); border-radius: 16px; margin-bottom: 30px;">📊</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Organizer Suite</h3>
            <p style="font-size: 1.05rem; line-height: 1.7;">Host events, manage registrations, track capacity in real-time, and download attendee lists. Professional event management.</p>
          </div>
        </div>
      </section>

      <footer class="landing-footer" style="padding: 60px 8%; border-top: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 30px;">
          <div class="logo" style="font-size: 1.4rem; font-weight: 800; color: var(--text-main);">EventHub</div>
          <div style="display: flex; gap: 40px; color: var(--text-muted); font-size: 0.95rem; font-weight: 500;">
            <a href="#" style="color: inherit; text-decoration: none;">Privacy</a>
            <a href="#" style="color: inherit; text-decoration: none;">Terms</a>
            <a href="#" style="color: inherit; text-decoration: none;">Contact</a>
          </div>
          <p style="color: var(--text-muted);">&copy; 2026 EventHub. Made for college students.</p>
        </div>
      </footer>
    </div>
    `;
  }

  document.getElementById('app').innerHTML = html();
}

