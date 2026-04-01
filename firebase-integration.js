import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ==============================================================================
// 🚨 CONFIGURACIÓN DE FIREBASE (Para el Cliente)
// ==============================================================================
// Reemplaza estos valores con los de tu proyecto de Firebase.
// Instrucciones detalladas en el mensaje que te entregó el asistente.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ==============================================================================
// INICIALIZACIÓN Y LÓGICA
// ==============================================================================
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let app, db;
if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase init error:", error);
  }
} else {
  console.warn("⚠️ Firebase no está configurado. Usando LocalStorage como fallback temporal.");
}

// --- Lógica del Sistema de Reseñas ---
const reviewForm = document.getElementById('reviewForm');
const ratingInput = document.getElementById('ratingValue');
const testimonialsGrid = document.getElementById('testimonialsGrid');
const starsInput = document.querySelectorAll('.stars-input i');

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderReview(review) {
  if (!testimonialsGrid) return;
  const card = document.createElement('div');
  card.className = 'testimonial-card-new';
  const starsHTML = Array(5).fill(0).map((_, i) => `<i class="fas fa-star" style="color: ${i < review.rating ? '#FFC107' : '#ddd'}"></i>`).join('');
  const initials = review.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  card.innerHTML = `
    <i class="fas fa-quote-left testimonial-quote-icon"></i>
    <div class="testimonial-stars">${starsHTML}</div>
    <p class="quote">"${escapeHTML(review.comment)}"</p>
    <div class="testimonial-author">
      <div class="author-avatar" style="background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center; font-family: var(--heading-font); font-weight: 700; font-size: 1.1rem;">${initials}</div>
      <div class="author-info">
        <span class="author-name">${escapeHTML(review.name)}</span>
        <span class="author-location">${escapeHTML(review.city)}</span>
      </div>
    </div>
  `;
  testimonialsGrid.appendChild(card);
}

function loadReviewsFallback() {
  const reviews = JSON.parse(localStorage.getItem('willyToursReviews') || '[]');
  if (testimonialsGrid) {
    // Keep hardcoded ones, just append local ones
    reviews.forEach(review => renderReview(review));
  }
}

if (reviewForm) {
  if (isConfigured && db) {
    // 1. Escuchar Reseñas en Tiempo Real desde Firestore
    const q = query(collection(db, "reviews"), orderBy("createdAt", "asc"));
    onSnapshot(q, (snapshot) => {
      // Clear dynamic reviews only? Since we have hardcoded ones, let's keep it simple:
      // We'll clear the grid and re-render everything to avoid duplicates, 
      // but we need to keep the hardcoded ones. For this implementation, 
      // we only append NEW docs that were added to the snapshot.
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          renderReview(change.doc.data());
        }
      });
    }, (error) => {
      console.error("Error fetching reviews:", error);
    });
  } else {
    loadReviewsFallback();
  }

  // 2. Enviar Reseñas
  reviewForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const city = document.getElementById('reviewCity').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const rating = parseInt(ratingInput?.value || 0);
    const submitBtn = reviewForm.querySelector('button[type="submit"]');

    if (!name || !city || !comment || rating === 0) {
      window.showToast?.('Por favor completa todos los campos y selecciona una calificación.', true);
      return;
    }

    const reviewData = { name, city, comment, rating, createdAt: serverTimestamp() };
    const fallbackReviewData = { name, city, comment, rating, createdAt: new Date().toISOString() };
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';

    try {
      if (isConfigured && db) {
        await addDoc(collection(db, "reviews"), reviewData);
        // It will render automatically via onSnapshot
      } else {
        const reviews = JSON.parse(localStorage.getItem('willyToursReviews') || '[]');
        reviews.push(fallbackReviewData);
        localStorage.setItem('willyToursReviews', JSON.stringify(reviews));
        renderReview(fallbackReviewData);
      }
      reviewForm.reset();
      if (starsInput.length > 0) starsInput.forEach(s => s.classList.remove('active'));
      if (ratingInput) ratingInput.value = '';
      window.showToast?.('¡Gracias por tu opinión! Tu reseña ha sido publicada.');
    } catch (e) {
      console.error("Error adding document: ", e);
      window.showToast?.('Hubo un error al enviar tu reseña.', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar Reseña <i class="fas fa-paper-plane"></i>';
    }
  });
}

// --- Lógica del Formulario de Contacto (Sobre Nosotros) ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('contactName').value.trim();
    const telefono = document.getElementById('contactPhone').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const mensaje = document.getElementById('contactMessage').value.trim();
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    if (!nombre || !telefono || !mensaje) {
      window.showToast?.('Por favor completa los campos requeridos.', true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';

    try {
      if (isConfigured && db) {
        await addDoc(collection(db, "contact_messages"), {
          nombre, telefono, email, mensaje, createdAt: serverTimestamp()
        });
      } else {
        console.warn("Mensaje no enviado a Firestore (sin configurar). Guardando localmente para prueba.");
        const msgs = JSON.parse(localStorage.getItem('willyToursMessages') || '[]');
        msgs.push({ nombre, telefono, email, mensaje, createdAt: new Date().toISOString() });
        localStorage.setItem('willyToursMessages', JSON.stringify(msgs));
      }
      contactForm.reset();
      window.showToast?.('¡Mensaje enviado con éxito! Nos comunicaremos contigo pronto.');
    } catch (e) {
      console.error("Error sending message: ", e);
      window.showToast?.('Hubo un error al enviar tu mensaje.', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
    }
  });
}

// Toast helper exported to window if it doesn't exist from main.js
if (!window.showToast) {
  window.showToast = function(message, isError = false) {
    const existing = document.querySelector('.review-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'review-toast';
    if (isError) toast.style.backgroundColor = '#d32f2f';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  };
}
