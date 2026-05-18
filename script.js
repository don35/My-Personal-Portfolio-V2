// Theme toggle with localStorage persistence
(function () {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored ? stored === 'dark' : prefersDark;
  document.body.classList.toggle('dark', isDark);

  document.addEventListener('DOMContentLoaded', () => {
    const heroPic = document.getElementById('hero-pic');
    const btn = document.getElementById('theme-toggle');

    // Set correct image on load with NO animation
    function setpic(dark) {
      if (!heroPic) return;
      heroPic.src = dark ? heroPic.dataset.dark : heroPic.dataset.light;
    }

    // Swap image with fade transition
    function swapPic(dark) {
      if (!heroPic) return;
      heroPic.style.opacity = '0';
      setTimeout(() => {
        heroPic.src = dark ? heroPic.dataset.dark : heroPic.dataset.light;
        heroPic.style.opacity = '1';
      }, 300);
    }

    setpic(isDark); // no animation on first load

    btn.addEventListener('click', () => {
      const next = !document.body.classList.contains('dark');
      document.body.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      swapPic(next); // animate only on toggle
    }); 
  });
})();

// Active nav link via IntersectionObserver
(function () {
  const links = document.querySelectorAll('.nav-link');
  const map = new Map();
  links.forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) map.set(id, a);
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          const a = map.get(e.target.id);
          if (a) a.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  map.forEach((_, id) => observer.observe(document.getElementById(id)));
})();

// Render projects
// Render projects
const projects = [
  { 
    title: 'ACTION Center Public Information', 
    description: 'Disaster preparedness and information management platform for communities and local government units.', 
    tech: ['HTML', 'CSS', 'PHP', 'MySQL', 'JavaScript'],
    image: 'images/batstateu.png',
    category: 'webapp'
  },
  { 
    title: 'DREAM Academy', 
    description: 'Educational platform providing information, announcements, and academic resources.', 
    tech: ['HTML', 'CSS', 'PHP', 'MySQL', 'JavaScript'],
    image: 'images/dreamacademy.png',
    category: 'webapp'
  },
  { 
    title: 'BANGIS', 
    description: 'Animal Bite Management Gateway Information System for rabies vaccine and outbreak management.', 
    tech: ['HTML', 'CSS', 'PHP', 'MySQL', 'JavaScript'],
    image: 'images/bangis.png',
    category: 'webapp'
  },
  { 
    title: 'CC Verification Report Generator', 
    description: 'System for automating and managing credit card verification reports.', 
    tech: ['HTML', 'Tailwind CSS', 'JavaScript'],
    image: 'images/rcbc1.png',
    category: 'webapp'
  },
  { title: 'Built Different', 
    description: 'Promotional Website for Built Different', 
    tech: ['Low Code / Wix'], 
    image: 'images/wix.png', 
    category: 'lowcode' },

  { title: 'Built Different Mobile App Mock Up', 
    description: 'Built Different Mobile App Mock Up', 
    tech: ['Figma'], 
    image: 'images/figma.png', 
    category: 'figma' },
    
    {title: 'Lush Shole Web App Mock Up', 
    description: 'Lush Shole Web App Mock Up', 
    tech: ['Figma'], 
    image: 'images/figma1.png', 
    category: 'figma' },
];

function renderProjects(filter) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  // Fade out first
  grid.classList.add('fade-out');

  setTimeout(() => {
    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="muted" style="padding: 1rem 0;">No projects in this category yet.</p>`;
    } else {
      grid.innerHTML = filtered.map((p) => `
        <article class="card project-card">
          <div class="project-thumb">
            <img src="${p.image}" alt="${p.title} screenshot" loading="lazy"
              onerror="this.style.display='none'" />
          </div>
          <h3>${p.title}</h3>
          <p class="desc">${p.description}</p>
          <div class="pills">${p.tech.map((t) => `<span class="pill">${t}</span>`).join('')}</div>
          <a href="#" class="view">View Project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></a>
        </article>
      `).join('');
    }

    // Fade back in
    grid.classList.remove('fade-out');
    grid.classList.add('fade-in');

    setTimeout(() => grid.classList.remove('fade-in'), 250);

  }, 250); // wait for fade-out to finish before swapping content
}

// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.tab);
  });
});

// Initial render
renderProjects('all');

// ── Chatbot Widget ── 
const toggle   = document.getElementById('chat-toggle');
const chatWin  = document.getElementById('chat-window');
const closeBtn = document.getElementById('chat-close');
const input    = document.getElementById('chat-input');
const sendBtn  = document.getElementById('chat-send');
const messages = document.getElementById('chat-messages');
const badge    = document.getElementById('fab-badge');
const chips    = document.querySelectorAll('.chip');

// Ping sound
function playPing() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = 'sine';
  o.frequency.setValueAtTime(880, ctx.currentTime);
  g.gain.setValueAtTime(0.08, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  o.start(ctx.currentTime);
  o.stop(ctx.currentTime + 0.4);
}

const responses = {
  skills:      "I work with PHP, MySQL, JavaScript, HTML, CSS, and Tailwind CSS on both frontend and backend projects.",
  projects:    "I've built 4+ web app projects — ACTION Center, DREAM Academy, BANGIS, and a CC Verification Report Generator. Im also creating some web design using FIgma and mockup",
  experience:  "I'm currently a Quality Analyst at SP Madrid Philippines. I also did OJT as a Backend Developer at BatStateU ACTION Center.",
  education:   "I graduated Cum Laude with a BS in Information Technology from Batangas State University — Alangilan Campus in 2024.",
  contact:     "You can reach me via email or LinkedIn!",
  hi:          "Hey there! 👋 Ask me about my skills, projects, experience, or education!",
  freelance:   "Yes, I'm open to freelance and project-based work! Feel free to reach out via email.",
  salary:      "I'm open to discuss compensation depending on the project scope and requirements.",
  availability:"I'm currently employed but open to freelance and side projects. Let's talk!",
};

const linkCards = {
  contact: [
    { icon: 'ti-mail',     label: 'fernandobingga5@gmail.com', href: 'mailto:fernandobingga5@gmail.com' },
    { icon: 'ti-brand-linkedin', label: 'linkedin.com/in/fernandobingga', href: 'https://www.linkedin.com/in/fernandobingga/' },
  ],
  projects: [
    { icon: 'ti-brand-github', label: 'View on GitHub', href: 'https://github.com/don35' },
  ],
};

function getBotReply(text) {
  const t = text.toLowerCase();
  if (/hi|hello|hey/.test(t))                                return { key: 'hi' };
  if (/skill|tech|stack|language/.test(t))                   return { key: 'skills' };
  if (/project|build|made|portfolio/.test(t))                return { key: 'projects', cards: linkCards.projects };
  if (/experience|job|analyst|developer|ojt/.test(t))        return { key: 'experience' };
  if (/school|education|university|degree|graduate/.test(t)) return { key: 'education' };
  if (/contact|email|reach|linkedin/.test(t))                return { key: 'contact', cards: linkCards.contact };
  if (/freelance|hire|available for/.test(t))                return { key: 'freelance' };
  if (/salary|rate|pay|compensation/.test(t))                return { key: 'salary' };
  if (/availability|free|busy|open/.test(t))                 return { key: 'availability' };
  return { key: null, text: "I'm not sure about that — feel free to email me at fernandobingga5@gmail.com!" };
}

function addMsg(text, sender) {
  const row = document.createElement('div');
  row.className = `msg-row ${sender}`;
  if (sender === 'bot') {
    row.innerHTML = `
      <img src="images/mypic.jpg" alt="Fern" class="chat-pic" />
      <div class="msg bot">${text}</div>
    `;
  } else {
    row.innerHTML = `<div class="msg user">${text}</div>`;
  }
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function addLinkCards(cards) {
  cards.forEach(card => {
    const a = document.createElement('a');
    a.className = 'msg-link-card';
    a.href = card.href;
    a.target = '_blank';
    a.innerHTML = `<i class="ti ${card.icon}" aria-hidden="true"></i> ${card.label}`;
    messages.appendChild(a);
    messages.scrollTop = messages.scrollHeight;
  });
}

function showTyping() {
  const row = document.createElement('div');
  row.className = 'msg-row bot typing-indicator';
  row.id = 'typing-row';
  row.innerHTML = `
    <img src="images/mypic.jpg" alt="Fern" class="chat-pic" />
    <div class="typing-bubbles"><span></span><span></span><span></span></div>
  `;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-row');
  if (t) t.remove();
}

function sendMessage(text) {
  const userText = text || input.value.trim();
  if (!userText) return;
  addMsg(userText, 'user');
  input.value = '';
  showTyping();

  setTimeout(() => {
    removeTyping();
    const reply = getBotReply(userText);
    const replyText = reply.key ? responses[reply.key] : reply.text;
    addMsg(replyText, 'bot');
    if (reply.cards) addLinkCards(reply.cards);
    playPing();

    // Show badge if chat is closed
    if (!chatWin.classList.contains('visible')) {
      badge.classList.remove('hidden');
    }
  }, 1000);
}

// Quick reply chips
chips.forEach(chip => {
  chip.addEventListener('click', () => sendMessage(chip.dataset.msg));
});

// Toggle open/close
toggle.addEventListener('click', () => {
  const isOpen = chatWin.classList.contains('visible');
  if (isOpen) {
    chatWin.classList.remove('visible');
    toggle.classList.remove('is-open');
  } else {
    requestAnimationFrame(() => chatWin.classList.add('visible'));
    toggle.classList.add('is-open');
    badge.classList.add('hidden'); // clear badge on open
  }
});

closeBtn.addEventListener('click', () => {
  chatWin.classList.remove('visible');
  toggle.classList.remove('is-open');
});

sendBtn.addEventListener('click', () => sendMessage());
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });