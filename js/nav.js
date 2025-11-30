const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    if (window.innerWidth <= 768) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    if (navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});
