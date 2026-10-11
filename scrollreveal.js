  const sr = ScrollReveal({
    distance: '30px',
    duration: 1600,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    opacity: 0,
    cleanup: true,   // removes inline styles after reveal so your hover effects still work
    viewFactor: 0.2
  });

  // Hero
  sr.reveal('.hero', { origin: 'bottom', scale: 0.96, duration: 1800, delay: 200 });

  // About
  sr.reveal('#about', { origin: 'bottom' });

  // Stats
  sr.reveal('.stat', { origin: 'bottom', interval: 300 });

  // Skills
  sr.reveal('#skills', { origin: 'bottom' });
  sr.reveal('#skills .grid-3 > div', { origin: 'bottom', interval: 250, delay: 300 });

  // Education & Awards
  sr.reveal('section.grid-2 > .card:nth-child(1)', { origin: 'left' });
  sr.reveal('section.grid-2 > .card:nth-child(2)', { origin: 'right', delay: 300 });

  // Experience
  sr.reveal('#experience', { origin: 'bottom' });
  sr.reveal('.exp-item', { origin: 'left', interval: 300, delay: 300 });

  // Projects
  sr.reveal('.section-title, .project-tabs', { origin: 'bottom', interval: 200 });

  // Contact (not #contact, because of the fixed chat widget)
  sr.reveal('#contact h2, .contact-block', { origin: 'bottom', interval: 200 });

  sr.reveal('#projects-grid > *', { origin: 'bottom', interval: 120 });

  sr.reveal('#certifications', { origin: 'bottom' });
  sr.reveal('.cert-card', { origin: 'bottom', interval: 300, delay: 300 });

const projectGrid = document.getElementById('projects-grid');

function revealProjects() {
  sr.reveal('#projects-grid > *', {
    origin: 'bottom',
    distance: '30px',
    duration: 1600,
    interval: 300,     // delay between each card
    scale: 0.97,
    viewFactor: 0.15
  });
}

revealProjects(); // cards that were already rendered
new MutationObserver(revealProjects).observe(projectGrid, { childList: true });