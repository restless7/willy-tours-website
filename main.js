// Contenido para main.js

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
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
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
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Lógica para todos los scripts que se ejecutan cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  
  // Slider de la sección "About Us"
  const slides = document.querySelectorAll('.about-slide');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  
  if (slides.length > 0 && nextBtn && prevBtn) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(slideIndex) {
      slides.forEach(slide => {
        slide.classList.remove('active-slide');
      });
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

  // Header que cambia con el scroll
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

  // ======================================================================
  // ===== INICIO DE LA SECCIÓN MODIFICADA PARA ANIMACIÓN DE TEXTO ======
  // ======================================================================

  // --- Lógica optimizada para animación de texto gradual ---
  const gradualText = document.querySelector('.gradual-spacing-text');
  if (gradualText) {
    // Guardamos una copia de los nodos hijos (texto, <br>, etc.)
    const childNodes = Array.from(gradualText.childNodes);
    
    // Vaciamos el contenedor original
    gradualText.innerHTML = ''; 

    // Recorremos cada nodo que guardamos
    childNodes.forEach(node => {
      // Si el nodo es TEXTO, lo procesamos palabra por palabra
      if (node.nodeType === 3) { // Node.TEXT_NODE
        const words = node.textContent.split(' ');
        words.forEach((word, index) => {
          if (word.length > 0) {
            // Creamos un contenedor para la palabra para evitar que se rompa
            const wordWrapper = document.createElement('span');
            wordWrapper.className = 'word-wrapper';

            // Dividimos la palabra en caracteres para la animación
            word.split('').forEach(char => {
              const charSpan = document.createElement('span');
              charSpan.textContent = char;
              wordWrapper.appendChild(charSpan);
            });
            
            gradualText.appendChild(wordWrapper);
          }
          // Añadimos un espacio después de cada palabra (si no es la última de la línea)
          if (index < words.length - 1) {
            gradualText.appendChild(document.createTextNode(' '));
          }
        });
      } 
      // Si el nodo es un ELEMENTO (como <br>), simplemente lo volvemos a añadir
      else if (node.nodeType === 1) { // Node.ELEMENT_NODE
        gradualText.appendChild(node.cloneNode(true));
      }
    });
  }

  // --- Lógica del Intersection Observer (con selector actualizado) ---
  const targets = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Aplica el retardo de animación solo al texto gradual
        if (entry.target.classList.contains('gradual-spacing-text')) {
          // El selector ahora apunta a las letras dentro de los contenedores de palabras
          const charSpans = entry.target.querySelectorAll('.word-wrapper > span');
          const delayMultiple = 0.04;
          charSpans.forEach((span, i) => {
            span.style.animationDelay = `${i * delayMultiple}s`;
          });
        }
        
        // Deja de observar para que la animación no se repita
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  targets.forEach(target => {
    observer.observe(target);
  });

  // ======================================================================
  // ======= FIN DE LA SECCIÓN MODIFICADA PARA ANIMACIÓN DE TEXTO =========
  // ======================================================================
});

// Script para activar las animaciones del Hero al cargar la página
window.addEventListener('load', function() {
  setTimeout(function() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.classList.add('animate-hero');
    }
  }, 200);
});