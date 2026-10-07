/**
 * =============================================================================
 * SACHIN // SOFTWARE ENGINEER PORTFOLIO - CORE INTERACTION ENGINE
 * =============================================================================
 * Modules Included:
 * 1. Web Audio API Retro 8-Bit Synthesizer (Bleeps, Chimes & Warp FX)
 * 2. Theme Manager (System prefers-color-scheme Detection + Manual Toggle)
 * 3. CRT Scanline Overlay Controller
 * 4. Hero Pixel Starfield Canvas Animator
 * 5. Vertical Navigation ScrollSpy & Mobile Drawer
 * 6. Skills Category Filter & Interactive Progress Animators
 * 7. Projects Filter & Interactive Blueprint Modal
 * 8. AI Chat Interface ("Sachin.AI") with NLP simulator & LLM API Hooks
 * 9. Contact Form Dispatcher with Simulated Email Transmission & Resend API Docs
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------------------------
  // 1. WEB AUDIO API RETRO 8-BIT SOUND ENGINE
  // Synthesizes retro game audio without needing external mp3 files.
  // ---------------------------------------------------------------------------
  class RetroAudioEngine {
    constructor() {
      this.audioCtx = null;
      this.enabled = true;
    }

    init() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playTone(freq, type = 'square', duration = 0.08, vol = 0.08) {
      if (!this.enabled) return;
      try {
        this.init();
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {
        // Graceful audio failover
      }
    }

    // High bleep for clicks
    click() {
      this.playTone(587.33, 'square', 0.05, 0.06); // D5
    }

    // Ascending arpeggio for actions/success
    success() {
      if (!this.enabled) return;
      setTimeout(() => this.playTone(523.25, 'square', 0.06, 0.06), 0);   // C5
      setTimeout(() => this.playTone(659.25, 'square', 0.06, 0.06), 60);  // E5
      setTimeout(() => this.playTone(783.99, 'square', 0.08, 0.06), 120); // G5
      setTimeout(() => this.playTone(1046.50, 'square', 0.12, 0.08), 180);// C6
    }

    // Laser / Warp chirp
    warp() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.audioCtx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.18);
      } catch (e) {}
    }
  }

  const sfx = new RetroAudioEngine();

  // Attach SFX sound toggle button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = soundToggleBtn?.querySelector('.btn-label');

  soundToggleBtn?.addEventListener('click', () => {
    const isEnabled = sfx.toggle();
    if (isEnabled) {
      soundIcon.className = 'fa-solid fa-volume-high';
      if (soundLabel) soundLabel.textContent = 'SFX: ON';
      showToast('🔊 8-Bit SFX Enabled');
      sfx.click();
    } else {
      soundIcon.className = 'fa-solid fa-volume-xmark';
      if (soundLabel) soundLabel.textContent = 'SFX: OFF';
      showToast('🔇 8-Bit SFX Muted');
    }
  });

  // ---------------------------------------------------------------------------
  // 2. NIGHT MODE & THEME CONTROLLER
  // Detects system preference via media queries and allows manual toggle override.
  // ---------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-sun';
      if (themeLabel) themeLabel.textContent = 'LIGHT';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      if (themeLabel) themeLabel.textContent = 'DARK';
    }
  }

  // Initialize theme from storage or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Detect system browser theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // Listen for system theme changes in real-time
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle button event
  themeToggleBtn?.addEventListener('click', () => {
    sfx.click();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`🌙 Theme switched to ${newTheme.toUpperCase()} mode`);
  });

  // ---------------------------------------------------------------------------
  // 3. CRT SCANLINE EFFECT TOGGLER
  // ---------------------------------------------------------------------------
  const crtToggleBtn = document.getElementById('crt-toggle-btn');
  const crtOverlay = document.getElementById('crt-overlay');

  crtToggleBtn?.addEventListener('click', () => {
    sfx.click();
    const isActive = crtOverlay?.classList.toggle('active');
    showToast(isActive ? '📺 CRT Scanlines: ON' : '📺 CRT Scanlines: OFF');
  });

  // ---------------------------------------------------------------------------
  // 4. FLOATING PIXEL PARTICLES CANVAS (HERO BACKGROUND)
  // ---------------------------------------------------------------------------
  const canvas = document.getElementById('pixel-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 45;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class PixelParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() > 0.8 ? 6 : (Math.random() > 0.5 ? 4 : 2);
        this.speedY = -(0.2 + Math.random() * 0.6);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = 0.2 + Math.random() * 0.7;
        this.colors = ['#00f0ff', '#ff007f', '#fbbf24', '#ffffff'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = canvas.height + 5;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
        ctx.globalAlpha = 1.0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new PixelParticle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ---------------------------------------------------------------------------
  // 5. VERTICAL NAVIGATION SCROLLSPY & MOBILE MENU
  // ---------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, footer');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar-wrapper');

  // Mobile menu toggle
  mobileMenuBtn?.addEventListener('click', () => {
    sfx.click();
    sidebar?.classList.toggle('mobile-open');
  });

  // Close sidebar on link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      sfx.click();
      if (window.innerWidth <= 768) {
        sidebar?.classList.remove('mobile-open');
      }
    });
  });

  // ScrollSpy implementation using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // ---------------------------------------------------------------------------
  // 6. SKILLS SECTION CATEGORY FILTER
  // ---------------------------------------------------------------------------
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sfx.click();
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 7. PROJECTS SECTION: FILTERING & INTERACTIVE BLUEPRINT MODAL
  // ---------------------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Filter Projects
  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.click();
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Detailed Project Database for Modal
  const projectData = {
    'project-1': {
      title: 'CYBERQUEST 16-BIT RPG ENGINE',
      category: 'Game Engine / Full Stack System',
      description: 'A modular, high-throughput 2D RPG simulation engine written in TypeScript and HTML5 Canvas with WebSocket multiplayer state synchronization. Built with zero external gaming frameworks to ensure maximum performance and pixel control.',
      features: [
        'Custom A* pathfinding algorithm for intelligent NPC traversal',
        'Web Audio synthesizer generating dynamic 8-bit chiptune soundtracks in real-time',
        'Procedural dungeon generation using Cellular Automata algorithms',
        'Delta compression state synchronization handling 60fps tick rate'
      ],
      tech: ['TypeScript', 'HTML5 Canvas', 'WebSockets', 'Node.js', 'Web Audio API', 'Redis'],
      github: 'https://github.com',
      live: '#hero'
    },
    'project-2': {
      title: 'NEURALPULSE AI OBSERVABILITY PLATFORM',
      category: 'AI / Machine Learning & Cloud Observability',
      description: 'A comprehensive monitoring, token-tracking, and evaluation platform for production LLM pipelines. Detects hallucination anomalies, calculates semantic embeddings drift, and tracks cost metrics per prompt token in real-time.',
      features: [
        'Real-time streaming telemetry with sub-50ms latency metrics',
        'Automated semantic similarity clustering using cosine distance',
        'Integration ready for OpenAI, Anthropic Claude, and Gemini API models',
        'Interactive time-series graphs rendered with WebGL'
      ],
      tech: ['Next.js', 'Python FastAPI', 'TimescaleDB', 'OpenAI API', 'Docker', 'Tailwind/CSS'],
      github: 'https://github.com',
      live: '#hero'
    },
    'project-3': {
      title: 'CLOUDVAULT S3-COMPATIBLE STORAGE GATEWAY',
      category: 'Distributed Systems & Cloud Storage',
      description: 'A high-performance object store and caching proxy compatible with Amazon S3 APIs. Features distributed file chunking, automatic deduplication, and zero-knowledge AES-256 client-side encryption.',
      features: [
        'Custom gRPC storage nodes with Raft consensus protocol',
        'Content-addressable storage engine with SHA-256 integrity verification',
        'Multi-tiered caching with in-memory Redis and NVMe disk caching',
        'Zero-downtime hot reloading of cluster topologies'
      ],
      tech: ['Go (Golang)', 'gRPC', 'Docker', 'Redis', 'AES-256', 'Linux'],
      github: 'https://github.com',
      live: '#hero'
    },
    'project-4': {
      title: 'DEVFORGE IN-BROWSER SANDBOXED IDE',
      category: 'Developer Tools & WebAssembly',
      description: 'A lightning-fast collaborative code sandbox executing Python, JavaScript, and C++ code directly in the browser using WebAssembly. Offers real-time multiplayer pair programming cursors via WebRTC.',
      features: [
        'In-browser WebAssembly isolated execution sandbox (Pyodide & Clang WASM)',
        'Monaco Editor integration with full LSP auto-completion and syntax tree',
        'Peer-to-peer WebRTC mesh network for zero-server lag collaborative editing',
        'Export projects directly to GitHub repository or ZIP archive'
      ],
      tech: ['React', 'WebAssembly', 'Monaco Editor', 'WebRTC', 'TypeScript'],
      github: 'https://github.com',
      live: '#hero'
    }
  };

  // Modal elements
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const modalBody = document.getElementById('modal-body-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOverlay = document.getElementById('modal-overlay');

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    sfx.warp();
    modalTitle.textContent = data.title;

    modalBody.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <span style="font-family: var(--font-terminal); font-size: 1.2rem; color: var(--accent-cyan);">${data.category}</span>
      </div>
      <p style="font-size: 1.05rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1.5rem;">
        ${data.description}
      </p>
      
      <h4 style="font-family: var(--font-pixel); font-size: 0.75rem; color: var(--accent-yellow); margin-bottom: 0.75rem;">
        KEY ARCHITECTURAL HIGHLIGHTS:
      </h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
        ${data.features.map(f => `<li style="display: flex; gap: 0.5rem; font-size: 0.95rem;"><span style="color: var(--accent-pink);">▶</span> <span>${f}</span></li>`).join('')}
      </ul>

      <h4 style="font-family: var(--font-pixel); font-size: 0.75rem; color: var(--accent-cyan); margin-bottom: 0.75rem;">
        TECH STACK MATRIX:
      </h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
        ${data.tech.map(t => `<span class="tech-chip" style="font-size: 0.9rem;">${t}</span>`).join('')}
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; border-top: 2px dashed var(--border-color); padding-top: 1.5rem;">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="pixel-btn pixel-btn-primary">
          <i class="fa-brands fa-github"></i> Inspect Source Code
        </a>
        <a href="${data.live}" class="pixel-btn pixel-btn-secondary" id="modal-live-btn">
          <i class="fa-solid fa-play"></i> Launch Simulation
        </a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    sfx.click();
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Attach modal trigger events
  document.querySelectorAll('.modal-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id') || btn.closest('.project-card')?.getAttribute('data-id');
      if (id) openProjectModal(id);
    });
  });

  modalCloseBtn?.addEventListener('click', closeProjectModal);
  modalOverlay?.addEventListener('click', closeProjectModal);

  // Close modal on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // ---------------------------------------------------------------------------
  // 8. AI CHAT INTERFACE INTEGRATION ("Sachin.AI")
  // Simulates intelligent conversational responses with NLP matching.
  // Code includes hooks for connecting live OpenAI / Claude / Gemini API!
  // ---------------------------------------------------------------------------
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatClearBtn = document.getElementById('chat-clear-btn');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  // Intelligent Knowledge Base for simulated responses
  const aiKnowledge = [
    {
      keywords: ['stack', 'tech', 'languages', 'skills', 'technologies', 'frameworks'],
      response: "Sachin's core technical arsenal includes <strong>TypeScript/JavaScript, Python, React, Next.js, Node.js, Go, PostgreSQL, Redis, Docker, and AWS</strong>. He specializes in designing distributed systems and building high-speed reactive frontends."
    },
    {
      keywords: ['project', 'projects', 'cyberquest', 'neuralpulse', 'cloudvault', 'work'],
      response: "Sachin has shipped over 35+ projects! Notable highlights include <strong>CyberQuest</strong> (a 16-bit RPG & state engine), <strong>NeuralPulse</strong> (an AI observability dashboard), and <strong>CloudVault</strong> (an encrypted S3-compatible storage gateway). You can click on the Blueprint buttons in the Projects section to explore detailed specs!"
    },
    {
      keywords: ['experience', 'years', 'background', 'career', 'history', 'role', 'senior'],
      response: "Sachin brings <strong>4+ years of professional engineering experience</strong>. He currently serves as a Senior Full Stack Engineer at Nexar Tech Labs, where he architected real-time dashboards for 500k+ daily active users and cut database latency by 45%."
    },
    {
      keywords: ['hire', 'available', 'availability', 'contract', 'freelance', 'job', 'fulltime', 'salary', 'rate'],
      response: "✅ <strong>Sachin is currently OPEN for hire!</strong> He is available for Senior Software Engineering roles, Full Stack Architecture contracts, and high-impact distributed systems consulting. You can send a direct dispatch through the Contact form below or email him at <code>sachin.dev@example.com</code>."
    },
    {
      keywords: ['contact', 'email', 'reach', 'message', 'phone', 'social', 'github', 'linkedin'],
      response: "You can reach Sachin directly via electronic mail at <strong><a href='mailto:sachin.dev@example.com' style='color:var(--accent-cyan);'>sachin.dev@example.com</a></strong>, connect on GitHub or LinkedIn via the footer links, or transmit a message in the Contact section on this page!"
    },
    {
      keywords: ['resume', 'cv', 'download', 'pdf'],
      response: "📄 You can request Sachin's complete verified CV/Resume directly through the contact form or download an overview. All verified credentials, degrees, and project references are available on request."
    },
    {
      keywords: ['education', 'degree', 'college', 'university', 'study'],
      response: "Sachin holds a <strong>Bachelor of Technology (B.Tech) in Computer Science & Engineering</strong>, graduated with First Class Distinction. He specialized in Data Structures, Algorithms, Operating Systems, and Distributed Computing."
    },
    {
      keywords: ['hi', 'hello', 'hey', 'greetings', 'who are you'],
      response: "Greetings! I am <strong>Sachin.AI</strong>, the neural companion of Sachin. Feel free to ask me anything about his technical background, engineering projects, availability, or skill matrix!"
    }
  ];

  function appendChatMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'ai-bubble'}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const avatarIcon = sender === 'user' ? 'fa-solid fa-user' : 'fa-solid fa-robot';

    bubble.innerHTML = `
      <div class="bubble-avatar"><i class="${avatarIcon}"></i></div>
      <div class="bubble-content">
        <p>${text}</p>
        <span class="bubble-time">${time}</span>
      </div>
    `;

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.className = 'chat-bubble ai-bubble';
    indicator.innerHTML = `
      <div class="bubble-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="bubble-content">
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicator;
  }

  /**
   * AI Query Processing Function
   * =========================================================================
   * NOTE FOR BACKEND/API INTEGRATION:
   * To hook up OpenAI / Gemini / Claude API in production, replace the local
   * keyword simulation below with a fetch() call to your backend server:
   * 
   * async function queryLiveLLM(userPrompt) {
   *   const response = await fetch('/api/chat', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ message: userPrompt })
   *   });
   *   const data = await response.json();
   *   return data.reply;
   * }
   * =========================================================================
   */
  function processAIQuery(query) {
    const lower = query.toLowerCase();
    
    // Find matching response in local knowledge base
    for (const item of aiKnowledge) {
      if (item.keywords.some(k => lower.includes(k))) {
        return item.response;
      }
    }

    // Default intelligent fallback response
    return `That is an interesting inquiry! As Sachin's AI avatar, I can confirm Sachin possesses deep knowledge across full-stack engineering, cloud infrastructure, and modern software design. For specialized requirements regarding "<em>${query}</em>", please feel free to leave a direct dispatch in the Contact section!`;
  }

  function handleUserMessage(msg) {
    const cleanMsg = msg.trim();
    if (!cleanMsg) return;

    sfx.click();
    appendChatMessage('user', cleanMsg);
    chatInput.value = '';

    const indicator = showTypingIndicator();

    // Simulate realistic neural processing latency
    setTimeout(() => {
      indicator.remove();
      const reply = processAIQuery(cleanMsg);
      sfx.playTone(800, 'sine', 0.08, 0.04);
      appendChatMessage('ai', reply);
    }, 750);
  }

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(chatInput.value);
  });

  // Suggestion chips handler
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        handleUserMessage(prompt);
      }
    });
  });

  // Clear chat history
  chatClearBtn?.addEventListener('click', () => {
    sfx.click();
    chatMessages.innerHTML = `
      <div class="chat-bubble ai-bubble">
        <div class="bubble-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="bubble-content">
          <p>🧹 Chat log initialized. How may I assist you today?</p>
          <span class="bubble-time">JUST NOW</span>
        </div>
      </div>
    `;
    showToast('✨ Chat history cleared');
  });

  // ---------------------------------------------------------------------------
  // 9. CONTACT FORM WITH EMAIL API INTEGRATION & FEEDBACK
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const formStatusMsg = document.getElementById('form-status-msg');

  /**
   * =========================================================================
   * EMAIL API INTEGRATION INSTRUCTIONS (Resend / EmailJS / Formspree):
   * 
   * Example using Resend API (via serverless API endpoint /api/send-email):
   * 
   * const res = await fetch('https://api.resend.com/emails', {
   *   method: 'POST',
   *   headers: {
   *     'Authorization': 'Bearer YOUR_RESEND_API_KEY',
   *     'Content-Type': 'application/json'
   *   },
   *   body: JSON.stringify({
   *     from: 'Portfolio Contact <onboarding@resend.dev>',
   *     to: ['sachin.dev@example.com'],
   *     subject: `[Portfolio Inquiry] ${formData.subject}`,
   *     html: `<p><strong>From:</strong> ${formData.name} (${formData.email})</p><p>${formData.message}</p>`
   *   })
   * });
   * =========================================================================
   */
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('⚠️ Please fill out all required dispatch fields!');
      return;
    }

    sfx.click();

    // UI Loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText?.classList.add('d-none');
    btnLoading?.classList.remove('d-none');
    submitBtn.disabled = true;

    // Simulate async network transmission
    setTimeout(() => {
      btnText?.classList.remove('d-none');
      btnLoading?.classList.add('d-none');
      submitBtn.disabled = false;

      sfx.success();
      contactForm.reset();

      if (formStatusMsg) {
        formStatusMsg.className = 'form-status-msg success';
        formStatusMsg.textContent = `🚀 DISPATCH TRANSMITTED! Thank you, ${name}. Sachin will reply within 24 hours.`;
        formStatusMsg.style.display = 'block';

        setTimeout(() => {
          formStatusMsg.style.display = 'none';
        }, 8000);
      }

      showToast('✅ Message successfully transmitted to Sachin!');
    }, 1200);
  });

  // ---------------------------------------------------------------------------
  // 10. TOAST NOTIFICATION UTILITY
  // ---------------------------------------------------------------------------
  function showToast(message, duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'pixel-toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Back to top audio feedback
  document.getElementById('back-to-top-btn')?.addEventListener('click', () => {
    sfx.warp();
  });

});
