const hamburger = document.getElementById('hamburger');
const navActivator = document.getElementById('nav-activator');
const navbar = document.getElementById('navbar');
const overlay = document.getElementById('overlay');

function closeNav() {
  navActivator.classList.remove('active');
  navbar.classList.remove('active');
  overlay.classList.remove('active');

  hamburger.classList.remove('ti-x');
  hamburger.classList.add('ti-menu-2');
}

navActivator.addEventListener('click', () => {
  navActivator.classList.toggle('active');

  const isMenu = hamburger.classList.contains('ti-menu-2');

  hamburger.classList.replace(
    isMenu ? 'ti-menu-2' : 'ti-x',
    isMenu ? 'ti-x' : 'ti-menu-2'
  );

  navbar.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', closeNav);

/* Dropdown */

const dropBtn = document.getElementById('dropBtn');
const dropContent = document.getElementById('dropContent');

dropBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  dropContent.classList.toggle('hidden');
});

window.addEventListener('click', () => {
  dropContent.classList.add('hidden');
});
