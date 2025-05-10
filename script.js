// Modal logic
const openModalBtn = document.getElementById('open-modal-btn');
const skillModal = document.getElementById('skill-modal');
const cancelBtn = document.getElementById('cancel-btn');
const addBtn = document.getElementById('add-btn');
const skillList = document.getElementById('skill-list');
const skillInput = document.getElementById('skill-input');

function openModal() {
  skillModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.getElementById('skill-input').focus();
}

function closeModal() {
  skillModal.style.display = 'none';
  document.body.style.overflow = '';
  document.getElementById('skill-input').value = '';
}

openModalBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
addBtn.addEventListener('click', function() {
  const newSkill = skillInput.value.trim();
  if (newSkill) {
    const li = document.createElement('li');
    li.textContent = newSkill;
    skillList.appendChild(li);
  }
  closeModal();
});

// Optional: Close modal on overlay click
skillModal.addEventListener('click', function(e) {
  if (e.target === skillModal) closeModal();
});

// --- Recommendations Carousel Logic ---
const recSlider = document.getElementById('recommendation-slider');
const recCards = recSlider ? recSlider.querySelectorAll('.recommendation-card') : [];
const recPrevBtn = document.getElementById('rec-prev-slide');
const recNextBtn = document.getElementById('rec-next-slide');
const recDots = document.getElementById('rec-slider-dots');
const recVisible = 3;
let recCurrent = 0;

function renderRecDots() {
  if (!recDots) return;
  recDots.innerHTML = '';
  const total = recCards.length - recVisible + 1;
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === recCurrent ? ' active' : '');
    dot.addEventListener('click', () => {
      recCurrent = i;
      showRecSlide(recCurrent);
    });
    recDots.appendChild(dot);
  }
}

function showRecSlide(index) {
  if (!recSlider) return;
  const maxIndex = recCards.length - recVisible;
  recCurrent = Math.max(0, Math.min(index, maxIndex));
  const card = recCards[0];
  const cardStyle = window.getComputedStyle(card);
  const cardWidth = card.offsetWidth;
  const sliderStyle = window.getComputedStyle(recSlider);
  const gap = parseInt(sliderStyle.gap) || 32;
  const moveX = recCurrent * (cardWidth + gap);
  console.log('showRecSlide:', { recCurrent, moveX, cardWidth, gap, maxIndex, totalCards: recCards.length });
  recSlider.style.transform = `translateX(-${moveX}px)`;
  renderRecDots();
}

if (recPrevBtn && recNextBtn) {
  recPrevBtn.addEventListener('click', () => {
    console.log('Prev button clicked');
    showRecSlide(recCurrent - 1);
  });
  recNextBtn.addEventListener('click', () => {
    console.log('Next button clicked');
    showRecSlide(recCurrent + 1);
  });
}

// Initialize rec carousel
if (recSlider) {
  showRecSlide(0);
}

// --- Scrollspy for Navbar Highlight ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
  let scrollPos = window.scrollY + 100; // Offset for fixed navbar
  sections.forEach(section => {
    if (
      scrollPos >= section.offsetTop &&
      scrollPos < section.offsetTop + section.offsetHeight
    ) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector('.nav-links a[href="#' + section.id + '"]');
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll);

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const mobileNavLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileNavLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileNavLinks.classList.remove('active');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileNavLinks.contains(e.target)) {
    hamburger.classList.remove('active');
    mobileNavLinks.classList.remove('active');
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Contact form validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const inputs = contactForm.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      validateInput(this);
    });
    
    input.addEventListener('blur', function() {
      validateInput(this);
    });
  });
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    
    if (isValid) {
      // Here you would typically send the form data to a server
      alert('Thank you for your message! I will get back to you soon.');
      contactForm.reset();
    }
  });
}

function validateInput(input) {
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = '';
  
  if (input.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  } else if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }
  
  // Remove existing error message if any
  const existingError = input.parentElement.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error message if validation failed
  if (!isValid) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = errorMessage;
    error.style.color = '#900C3F';
    error.style.fontSize = '0.8rem';
    error.style.marginTop = '4px';
    input.parentElement.appendChild(error);
    input.style.borderColor = '#900C3F';
  } else {
    input.style.borderColor = '#ccc';
  }
  
  return isValid;
}

// Intersection Observer for fade-in animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});
