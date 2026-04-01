// ==========================================================================
// Willy Tours - main.js
// ==========================================================================

// Inicialización de Swiper para Galería
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".mySwiper .swiper-button-next",
    prevEl: ".mySwiper .swiper-button-prev",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    }
  }
});

// Inicialización de Swiper para Consejos #RutaWilly
var rutaSwiper = new Swiper(".rutaSwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  centeredSlides: true,
  navigation: {
    nextEl: ".rutaSwiper .swiper-button-next",
    prevEl: ".rutaSwiper .swiper-button-prev",
  },
});

// ======================================================================
// DOM Ready
// ======================================================================
document.addEventListener('DOMContentLoaded', function() {
  
  // --- About Us Slider ---
  const slides = document.querySelectorAll('.about-slide');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  
  if (slides.length > 0 && nextBtn && prevBtn) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(slideIndex) {
      slides.forEach(slide => slide.classList.remove('active-slide'));
      slides[slideIndex].classList.add('active-slide');
    }

    nextBtn.addEventListener('click', function() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    });

    prevBtn.addEventListener('click', function() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    });
    
    showSlide(currentSlide);
  }

  // --- Header Scroll Effect ---
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Hamburger Menu ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');
  
  if (hamburgerBtn && mainNav) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
      hamburgerBtn.classList.toggle('active');
      mainNav.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
      hamburgerBtn.setAttribute('aria-expanded', mainNav.classList.contains('active'));
    }

    hamburgerBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu on link click
    mainNav.querySelectorAll('a:not(.dropdown-trigger)').forEach(link => {
      link.addEventListener('click', function() {
        if (mainNav.classList.contains('active')) {
          toggleMenu();
        }
      });
    });

    // Mobile dropdown toggle
    const dropdownTriggers = mainNav.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          this.closest('.nav-dropdown').classList.toggle('open');
        }
      });
    });
  }

  // --- Gradual Spacing Text Animation ---
  const gradualText = document.querySelector('.gradual-spacing-text');
  if (gradualText) {
    const childNodes = Array.from(gradualText.childNodes);
    gradualText.innerHTML = ''; 

    childNodes.forEach(node => {
      if (node.nodeType === 3) {
        const words = node.textContent.split(' ');
        words.forEach((word, index) => {
          if (word.length > 0) {
            const wordWrapper = document.createElement('span');
            wordWrapper.className = 'word-wrapper';
            word.split('').forEach(char => {
              const charSpan = document.createElement('span');
              charSpan.textContent = char;
              wordWrapper.appendChild(charSpan);
            });
            gradualText.appendChild(wordWrapper);
          }
          if (index < words.length - 1) {
            gradualText.appendChild(document.createTextNode(' '));
          }
        });
      } else if (node.nodeType === 1) {
        gradualText.appendChild(node.cloneNode(true));
      }
    });
  }

  // --- Intersection Observer for scroll animations ---
  const targets = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('gradual-spacing-text')) {
          const charSpans = entry.target.querySelectorAll('.word-wrapper > span');
          const delayMultiple = 0.04;
          charSpans.forEach((span, i) => {
            span.style.animationDelay = `${i * delayMultiple}s`;
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(target => observer.observe(target));

  // ======================================================================
  // REVIEW SYSTEM
  // ======================================================================
  
  const reviewForm = document.getElementById('reviewForm');
  const starsInput = document.querySelectorAll('.stars-input i');
  const ratingInput = document.getElementById('ratingValue');
  const testimonialsGrid = document.getElementById('testimonialsGrid');

  // Star rating interaction
  if (starsInput.length > 0) {
    let selectedRating = 0;

    starsInput.forEach(star => {
      star.addEventListener('mouseenter', function() {
        const rating = parseInt(this.dataset.rating);
        highlightStars(rating);
      });

      star.addEventListener('mouseleave', function() {
        highlightStars(selectedRating);
      });

      star.addEventListener('click', function() {
        selectedRating = parseInt(this.dataset.rating);
        if (ratingInput) ratingInput.value = selectedRating;
        highlightStars(selectedRating);
      });
    });

    function highlightStars(rating) {
      starsInput.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        if (starRating <= rating) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
    }
  }


  // ======================================================================
  // FAQ ACCORDION (for subpages)
  // ======================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        // Close others
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
      });
    }
  });

});

// --- Hero animation on load ---
window.addEventListener('load', function() {
  setTimeout(function() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.classList.add('animate-hero');
    }
  }, 200);
});