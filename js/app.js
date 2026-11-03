/**
 * K-Explore Events - Main Application Controller
 * Full-featured event management, real-time search & filters, live countdowns,
 * dark/light mode toggle, modals, and local storage persistence.
 */

import { CATEGORIES, INITIAL_EVENTS } from './events-data.js';
import { StorageManager } from './storage.js';
import { FormValidator } from './validation.js';

// Application State
const state = {
  events: [],
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'date-asc',
  selectedEventForModal: null,
  activeTimerInterval: null
};

// DOM Cache
const dom = {
  html: document.documentElement,
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeIcon: document.getElementById('theme-icon'),
  categoryPills: document.getElementById('category-pills'),
  eventsGrid: document.getElementById('events-grid'),
  featuredContainer: document.getElementById('featured-events-wrapper'),
  eventsCountBadge: document.getElementById('events-count-badge'),
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  sortSelect: document.getElementById('sort-select'),
  myRegistrationsBtn: document.getElementById('my-registrations-btn'),
  registrationsCountBadge: document.getElementById('registrations-count-badge'),
  mobileNavToggle: document.getElementById('mobile-nav-toggle'),
  navLinksWrapper: document.getElementById('nav-links-wrapper'),

  // Modals
  detailModal: document.getElementById('event-detail-modal'),
  detailModalBody: document.getElementById('event-detail-modal-body'),
  registerModal: document.getElementById('registration-modal'),
  registerForm: document.getElementById('registration-form'),
  registerEventSelect: document.getElementById('eventSelect'),
  ticketModal: document.getElementById('ticket-modal'),
  ticketModalBody: document.getElementById('ticket-modal-body'),
  myRegistrationsModal: document.getElementById('my-registrations-modal'),
  myRegistrationsList: document.getElementById('my-registrations-list'),

  // Toast Container
  toastContainer: document.getElementById('toast-container')
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initEventsData();
  renderCategories();
  renderFeaturedEvents();
  renderEvents();
  updateRegistrationBadge();
  setupEventListeners();
  startCountdownEngine();
});

function initTheme() {
  const currentTheme = StorageManager.getTheme();
  dom.html.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
}

function updateThemeIcon(theme) {
  if (!dom.themeIcon) return;
  if (theme === 'dark') {
    dom.themeIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    dom.themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    dom.themeIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    dom.themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
  }
}

function toggleTheme() {
  const current = dom.html.getAttribute('data-theme') || 'dark';
  const nextTheme = current === 'dark' ? 'light' : 'dark';
  dom.html.setAttribute('data-theme', nextTheme);
  StorageManager.setTheme(nextTheme);
  updateThemeIcon(nextTheme);
  showToast(`Switched to ${nextTheme} mode`, 'info');
}

function initEventsData() {
  const overrides = StorageManager.getSeatsOverrides();
  state.events = INITIAL_EVENTS.map(event => {
    const extraRegistered = overrides[event.id] || 0;
    const currentRegistered = Math.min(event.totalSeats, event.registeredCount + extraRegistered);
    return {
      ...event,
      currentRegistered,
      remainingSeats: Math.max(0, event.totalSeats - currentRegistered)
    };
  });
  populateEventDropdown();
}

function populateEventDropdown() {
  if (!dom.registerEventSelect) return;
  dom.registerEventSelect.innerHTML = '<option value="">-- Choose an Event --</option>';
  state.events.forEach(evt => {
    const option = document.createElement('option');
    option.value = evt.id;
    option.textContent = `${evt.title} (${evt.remainingSeats > 0 ? evt.remainingSeats + ' seats left' : 'Housefull'})`;
    if (evt.remainingSeats <= 0) {
      option.disabled = true;
    }
    dom.registerEventSelect.appendChild(option);
  });
}

// ==========================================
// RENDERERS
// ==========================================

function renderCategories() {
  if (!dom.categoryPills) return;
  dom.categoryPills.innerHTML = CATEGORIES.map(cat => `
    <button 
      class="category-pill ${state.activeCategory === cat.id ? 'active' : ''}" 
      data-category="${cat.id}"
      type="button"
    >
      <span>${cat.label}</span>
    </button>
  `).join('');

  dom.categoryPills.querySelectorAll('.category-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCategory = btn.getAttribute('data-category');
      dom.categoryPills.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEvents();
    });
  });
}

function renderFeaturedEvents() {
  if (!dom.featuredContainer) return;
  const featured = state.events.filter(e => e.featured);
  if (!featured.length) {
    dom.featuredContainer.parentElement.style.display = 'none';
    return;
  }

  dom.featuredContainer.innerHTML = featured.map(evt => {
    const formattedDate = new Date(evt.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `
      <div class="featured-card">
        <div class="featured-image-box">
          <img src="${evt.image}" alt="${escapeHtml(evt.title)}" loading="lazy" />
          <span class="badge featured-badge">★ Featured</span>
          <span class="badge category-badge-floating">${evt.categoryLabel}</span>
        </div>
        <div class="featured-content">
          <div class="card-meta">
            <span class="meta-item"><i class="icon-calendar"></i> ${formattedDate}</span>
            <span class="meta-item"><i class="icon-location"></i> ${evt.city}</span>
            <span class="meta-price ${evt.price === 'Free' ? 'free' : ''}">${evt.price}</span>
          </div>
          <h3 class="featured-title">${escapeHtml(evt.title)}</h3>
          <p class="featured-desc">${escapeHtml(evt.shortDesc)}</p>
          
          <div class="countdown-strip" data-target-date="${evt.date}">
            <span class="countdown-label">Starting in:</span>
            <div class="timer-digits">
              <span class="time-part"><strong class="t-days">00</strong>d</span>
              <span class="time-part"><strong class="t-hours">00</strong>h</span>
              <span class="time-part"><strong class="t-mins">00</strong>m</span>
              <span class="time-part"><strong class="t-secs">00</strong>s</span>
            </div>
          </div>

          <div class="featured-actions">
            <button class="btn btn-secondary btn-sm open-details-btn" data-event-id="${evt.id}">
              View Agenda
            </button>
            <button class="btn btn-primary btn-sm register-quick-btn" data-event-id="${evt.id}" ${evt.remainingSeats <= 0 ? 'disabled' : ''}>
              ${evt.remainingSeats > 0 ? 'Register Now' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  attachCardActionListeners(dom.featuredContainer);
}

function renderEvents() {
  if (!dom.eventsGrid) return;

  // Filter & Search
  let filtered = state.events.filter(evt => {
    const matchesCat = state.activeCategory === 'all' || evt.category === state.activeCategory;
    const query = state.searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      evt.title.toLowerCase().includes(query) ||
      evt.shortDesc.toLowerCase().includes(query) ||
      evt.venue.toLowerCase().includes(query) ||
      evt.city.toLowerCase().includes(query) ||
      evt.tags.some(t => t.toLowerCase().includes(query));
    
    return matchesCat && matchesSearch;
  });

  // Sort
  if (state.sortBy === 'date-asc') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (state.sortBy === 'date-desc') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (state.sortBy === 'name') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.sortBy === 'seats') {
    filtered.sort((a, b) => b.remainingSeats - a.remainingSeats);
  }

  // Update counter
  if (dom.eventsCountBadge) {
    dom.eventsCountBadge.textContent = `${filtered.length} event${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    dom.eventsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No matching events found</h3>
        <p>Try refining your search keyword or clearing the active category filter.</p>
        <button class="btn btn-outline btn-sm" id="reset-filters-btn">Reset All Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.activeCategory = 'all';
        state.searchQuery = '';
        if (dom.searchInput) dom.searchInput.value = '';
        renderCategories();
        renderEvents();
      });
    }
    return;
  }

  dom.eventsGrid.innerHTML = filtered.map(evt => {
    const formattedDate = new Date(evt.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const percentFilled = Math.min(100, Math.round((evt.currentRegistered / evt.totalSeats) * 100));
    const isSoldOut = evt.remainingSeats <= 0;

    return `
      <article class="event-card ${isSoldOut ? 'sold-out' : ''}" data-event-id="${evt.id}">
        <div class="card-media">
          <img src="${evt.image}" alt="${escapeHtml(evt.title)}" loading="lazy" />
          <div class="card-badges-top">
            <span class="badge cat-badge">${evt.categoryLabel}</span>
            <span class="badge price-badge ${evt.price === 'Free' ? 'price-free' : ''}">${evt.price}</span>
          </div>
          <div class="countdown-floating" data-target-date="${evt.date}">
            <span class="cf-item"><strong class="t-days">00</strong>d</span> :
            <span class="cf-item"><strong class="t-hours">00</strong>h</span> :
            <span class="cf-item"><strong class="t-mins">00</strong>m</span> :
            <span class="cf-item"><strong class="t-secs">00</strong>s</span>
          </div>
        </div>

        <div class="card-body">
          <div class="event-time-venue">
            <span class="time-item">📅 ${formattedDate} • ${evt.time.split('-')[0].trim()}</span>
            <span class="venue-item">📍 ${evt.city} (${evt.locationType})</span>
          </div>

          <h3 class="event-title" title="${escapeHtml(evt.title)}">${escapeHtml(evt.title)}</h3>
          <p class="event-desc">${escapeHtml(evt.shortDesc)}</p>

          <div class="card-seat-tracker">
            <div class="seat-info-line">
              <span class="seat-label">${isSoldOut ? 'Sold Out' : `${evt.remainingSeats} spots available`}</span>
              <span class="seat-pct">${percentFilled}% filled</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill ${percentFilled > 85 ? 'fill-warning' : ''}" style="width: ${percentFilled}%"></div>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn btn-outline btn-sm open-details-btn" data-event-id="${evt.id}">
              Details
            </button>
            <button class="btn btn-primary btn-sm register-quick-btn" data-event-id="${evt.id}" ${isSoldOut ? 'disabled' : ''}>
              ${isSoldOut ? 'Sold Out' : 'Register'}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  attachCardActionListeners(dom.eventsGrid);
  updateAllCountdowns();
}

function attachCardActionListeners(container) {
  if (!container) return;

  container.querySelectorAll('.open-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const eventId = btn.getAttribute('data-event-id');
      openEventDetails(eventId);
    });
  });

  container.querySelectorAll('.register-quick-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const eventId = btn.getAttribute('data-event-id');
      openRegistrationModal(eventId);
    });
  });

  // Clicking the card itself opens details
  container.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      const eventId = card.getAttribute('data-event-id');
      openEventDetails(eventId);
    });
  });
}

// ==========================================
// COUNTDOWN ENGINE
// ==========================================

function startCountdownEngine() {
  updateAllCountdowns();
  if (state.activeTimerInterval) clearInterval(state.activeTimerInterval);
  state.activeTimerInterval = setInterval(updateAllCountdowns, 1000);
}

function updateAllCountdowns() {
  const elements = document.querySelectorAll('[data-target-date]');
  const now = new Date().getTime();

  elements.forEach(el => {
    const targetStr = el.getAttribute('data-target-date');
    if (!targetStr) return;
    const target = new Date(targetStr).getTime();
    const diff = target - now;

    const daysEl = el.querySelector('.t-days');
    const hoursEl = el.querySelector('.t-hours');
    const minsEl = el.querySelector('.t-mins');
    const secsEl = el.querySelector('.t-secs');

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  });
}

// ==========================================
// EVENT DETAILS MODAL
// ==========================================

function openEventDetails(eventId) {
  const event = state.events.find(e => e.id === eventId);
  if (!event) return;

  state.selectedEventForModal = event;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const isSoldOut = event.remainingSeats <= 0;

  dom.detailModalBody.innerHTML = `
    <div class="modal-detail-hero">
      <img src="${event.image}" alt="${escapeHtml(event.title)}" class="modal-hero-img" />
      <div class="modal-hero-overlay">
        <span class="badge cat-badge">${event.categoryLabel}</span>
        <span class="badge location-type-badge">${event.locationType}</span>
      </div>
    </div>

    <div class="modal-detail-content">
      <div class="modal-quick-meta">
        <div class="quick-meta-pill">
          <span class="meta-icon">📅</span>
          <div>
            <strong>Date</strong>
            <p>${formattedDate}</p>
          </div>
        </div>
        <div class="quick-meta-pill">
          <span class="meta-icon">⏰</span>
          <div>
            <strong>Time</strong>
            <p>${event.time}</p>
          </div>
        </div>
        <div class="quick-meta-pill">
          <span class="meta-icon">📍</span>
          <div>
            <strong>Venue</strong>
            <p>${event.venue}, ${event.city}</p>
          </div>
        </div>
        <div class="quick-meta-pill">
          <span class="meta-icon">🎟️</span>
          <div>
            <strong>Pass Price</strong>
            <p>${event.price}</p>
          </div>
        </div>
      </div>

      <div class="modal-countdown-box" data-target-date="${event.date}">
        <span class="mc-title">Event Starts In:</span>
        <div class="mc-digits">
          <span class="mc-unit"><strong class="t-days">00</strong><small>Days</small></span>
          <span class="mc-colon">:</span>
          <span class="mc-unit"><strong class="t-hours">00</strong><small>Hours</small></span>
          <span class="mc-colon">:</span>
          <span class="mc-unit"><strong class="t-mins">00</strong><small>Mins</small></span>
          <span class="mc-colon">:</span>
          <span class="mc-unit"><strong class="t-secs">00</strong><small>Secs</small></span>
        </div>
      </div>

      <h2 class="modal-event-title">${escapeHtml(event.title)}</h2>
      <p class="modal-event-description">${escapeHtml(event.fullDesc)}</p>

      ${event.speakers && event.speakers.length ? `
        <div class="modal-section">
          <h4 class="section-title">Featured Speakers & Mentors</h4>
          <div class="speakers-grid">
            ${event.speakers.map(s => `
              <div class="speaker-card">
                <img src="${s.avatar}" alt="${escapeHtml(s.name)}" class="speaker-avatar" />
                <div class="speaker-info">
                  <h5 class="speaker-name">${escapeHtml(s.name)}</h5>
                  <p class="speaker-role">${escapeHtml(s.role)} • <span class="speaker-company">${escapeHtml(s.company)}</span></p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${event.schedule && event.schedule.length ? `
        <div class="modal-section">
          <h4 class="section-title">Event Schedule & Timeline</h4>
          <div class="timeline-list">
            ${event.schedule.map(item => `
              <div class="timeline-item">
                <div class="timeline-time">${item.time}</div>
                <div class="timeline-dot"></div>
                <div class="timeline-body">
                  <strong>${escapeHtml(item.title)}</strong>
                  <p>${escapeHtml(item.desc)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="modal-action-bar">
        <div class="modal-seat-notice">
          ${isSoldOut ? '<strong>Sold Out</strong> - No seats remaining.' : `<strong>${event.remainingSeats} spots remaining</strong> out of ${event.totalSeats}`}
        </div>
        <button class="btn btn-primary btn-lg" id="modal-proceed-register-btn" ${isSoldOut ? 'disabled' : ''}>
          ${isSoldOut ? 'Sold Out' : 'Register for This Event'}
        </button>
      </div>
    </div>
  `;

  document.getElementById('modal-proceed-register-btn')?.addEventListener('click', () => {
    closeModal(dom.detailModal);
    openRegistrationModal(event.id);
  });

  updateAllCountdowns();
  openModal(dom.detailModal);
}

// ==========================================
// REGISTRATION MODAL & WORKFLOW
// ==========================================

function openRegistrationModal(preSelectedEventId = null) {
  populateEventDropdown();

  if (preSelectedEventId && dom.registerEventSelect) {
    dom.registerEventSelect.value = preSelectedEventId;
  }

  FormValidator.resetValidation(dom.registerForm);
  openModal(dom.registerModal);
}

function handleRegistrationSubmit(e) {
  e.preventDefault();

  const isFormValid = FormValidator.validateForm(dom.registerForm);
  if (!isFormValid) {
    showToast('Please correct the highlighted errors in the form.', 'error');
    return;
  }

  const formData = new FormData(dom.registerForm);
  const eventId = formData.get('eventSelect');
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const phone = formData.get('phone').trim();
  const organization = (formData.get('organization') || '').trim();
  const ticketType = formData.get('ticketType') || 'General Attendee';

  const event = state.events.find(e => e.id === eventId);
  if (!event) {
    showToast('Invalid event selected.', 'error');
    return;
  }

  if (event.remainingSeats <= 0) {
    showToast('Sorry, this event just sold out!', 'error');
    return;
  }

  // Duplicate registration check
  if (StorageManager.isAlreadyRegistered(eventId, email)) {
    showToast(`You have already registered for this event with ${email}!`, 'warning');
    return;
  }

  // Save to Storage
  const registrationRecord = StorageManager.saveRegistration({
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.date,
    eventTime: event.time,
    eventVenue: event.venue,
    eventCity: event.city,
    eventPrice: event.price,
    name,
    email,
    phone,
    organization,
    ticketType
  });

  // Refresh application state
  initEventsData();
  renderEvents();
  renderFeaturedEvents();
  updateRegistrationBadge();

  // Close Registration Form Modal
  closeModal(dom.registerModal);
  dom.registerForm.reset();

  // Launch Confetti Celebration!
  triggerConfetti();

  // Open Ticket / Confirmation Modal
  openTicketModal(registrationRecord);
  showToast('Registration successful! Your digital pass has been generated.', 'success');
}

// ==========================================
// DIGITAL TICKET MODAL & QR CODE
// ==========================================

function openTicketModal(ticket) {
  const formattedDate = new Date(ticket.eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  dom.ticketModalBody.innerHTML = `
    <div class="ticket-wrapper" id="printable-ticket">
      <div class="ticket-header">
        <div class="ticket-brand">
          <span class="ticket-logo-mark">⚡</span>
          <span>K-EXPLORE EVENTS</span>
        </div>
        <div class="ticket-status-pill">VERIFIED PASS</div>
      </div>

      <div class="ticket-body">
        <div class="ticket-row-main">
          <span class="ticket-eyebrow">${ticket.ticketType.toUpperCase()}</span>
          <h2 class="ticket-event-name">${escapeHtml(ticket.eventTitle)}</h2>
        </div>

        <div class="ticket-details-grid">
          <div class="ticket-info-cell">
            <label>ATTENDEE</label>
            <strong>${escapeHtml(ticket.name)}</strong>
          </div>
          <div class="ticket-info-cell">
            <label>BOOKING ID</label>
            <strong class="ticket-code">${ticket.id}</strong>
          </div>
          <div class="ticket-info-cell">
            <label>DATE & TIME</label>
            <p>${formattedDate}<br/>${ticket.eventTime}</p>
          </div>
          <div class="ticket-info-cell">
            <label>VENUE</label>
            <p>${escapeHtml(ticket.eventVenue)}<br/>${ticket.eventCity}</p>
          </div>
          <div class="ticket-info-cell">
            <label>CONTACT EMAIL</label>
            <p>${escapeHtml(ticket.email)}</p>
          </div>
          <div class="ticket-info-cell">
            <label>PRICE</label>
            <strong>${ticket.eventPrice}</strong>
          </div>
        </div>

        <div class="ticket-divider">
          <div class="divider-notch left"></div>
          <div class="divider-line"></div>
          <div class="divider-notch right"></div>
        </div>

        <div class="ticket-footer-strip">
          <div class="ticket-qr-area">
            <canvas id="ticket-qr-canvas" width="100" height="100"></canvas>
            <span class="qr-caption">Scan at entry gate</span>
          </div>
          <div class="ticket-instructions">
            <p><strong>Entry Policy:</strong> Please present this QR code along with a valid photo ID upon arrival at the venue. Pass non-transferable.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="ticket-modal-actions">
      <button class="btn btn-secondary" id="print-ticket-btn">
        🖨️ Print / Save Ticket
      </button>
      <button class="btn btn-primary" id="view-all-reg-btn">
        View My Registrations
      </button>
    </div>
  `;

  // Draw procedural QR pattern on canvas
  drawProceduralQR('ticket-qr-canvas', ticket.id);

  document.getElementById('print-ticket-btn')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('view-all-reg-btn')?.addEventListener('click', () => {
    closeModal(dom.ticketModal);
    openMyRegistrationsModal();
  });

  openModal(dom.ticketModal);
}

// Procedural QR-style Canvas Renderer (100% offline, zero-dependency)
function drawProceduralQR(canvasId, seedText) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 100;
  const grid = 21; // standard QR version 1 is 21x21 modules
  const cellSize = size / grid;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Simple deterministic hash based on seedText
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = ((hash << 5) - hash) + seedText.charCodeAt(i);
    hash |= 0;
  }

  // Draw QR corner positioning targets
  const drawTarget = (x, y) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  };

  drawTarget(0, 0);
  drawTarget(14, 0);
  drawTarget(0, 14);

  // Fill pseudo-random inner payload modules
  ctx.fillStyle = '#0f172a';
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      // Skip corner finder patterns
      if ((r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8)) continue;

      const pseudoBit = ((hash ^ (r * 31 + c * 17)) & 1);
      if (pseudoBit === 1 || (r % 2 === 0 && c % 3 === 0)) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.4, cellSize - 0.4);
      }
    }
  }
}

// ==========================================
// "MY REGISTRATIONS" MANAGEMENT
// ==========================================

function updateRegistrationBadge() {
  const registrations = StorageManager.getRegistrations();
  if (dom.registrationsCountBadge) {
    dom.registrationsCountBadge.textContent = registrations.length;
    dom.registrationsCountBadge.style.display = registrations.length > 0 ? 'inline-flex' : 'none';
  }
}

function openMyRegistrationsModal() {
  const registrations = StorageManager.getRegistrations();

  if (registrations.length === 0) {
    dom.myRegistrationsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎟️</div>
        <h3>No Registrations Yet</h3>
        <p>You haven't registered for any events yet. Browse our catalog and secure your pass today!</p>
        <button class="btn btn-primary btn-sm" id="empty-explore-btn">Browse Events</button>
      </div>
    `;
    document.getElementById('empty-explore-btn')?.addEventListener('click', () => {
      closeModal(dom.myRegistrationsModal);
      dom.eventsGrid?.scrollIntoView({ behavior: 'smooth' });
    });
  } else {
    dom.myRegistrationsList.innerHTML = registrations.map(reg => {
      const formattedDate = new Date(reg.eventDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return `
        <div class="registered-item-card" data-reg-id="${reg.id}">
          <div class="registered-item-info">
            <div class="reg-top-line">
              <span class="badge cat-badge">${reg.id}</span>
              <span class="badge reg-status-confirmed">Active Pass</span>
            </div>
            <h4 class="reg-event-title">${escapeHtml(reg.eventTitle)}</h4>
            <div class="reg-meta-details">
              <span>📅 ${formattedDate} (${reg.eventTime})</span>
              <span>📍 ${escapeHtml(reg.eventVenue)}, ${reg.eventCity}</span>
              <span>👤 ${escapeHtml(reg.name)} (${reg.ticketType})</span>
            </div>
          </div>
          <div class="registered-item-actions">
            <button class="btn btn-outline btn-sm view-pass-btn" data-reg-id="${reg.id}">
              View Pass
            </button>
            <button class="btn btn-danger-outline btn-sm cancel-reg-btn" data-reg-id="${reg.id}">
              Cancel
            </button>
          </div>
        </div>
      `;
    }).join('');

    dom.myRegistrationsList.querySelectorAll('.view-pass-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-reg-id');
        const reg = registrations.find(r => r.id === id);
        if (reg) {
          closeModal(dom.myRegistrationsModal);
          openTicketModal(reg);
        }
      });
    });

    dom.myRegistrationsList.querySelectorAll('.cancel-reg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-reg-id');
        if (confirm('Are you sure you want to cancel this registration? Your seat will be returned to the pool.')) {
          StorageManager.cancelRegistration(id);
          initEventsData();
          renderEvents();
          renderFeaturedEvents();
          updateRegistrationBadge();
          openMyRegistrationsModal(); // Re-render modal
          showToast('Registration cancelled. Your pass has been invalidated.', 'info');
        }
      });
    });
  }

  openModal(dom.myRegistrationsModal);
}

// ==========================================
// MODAL CONTROLS & EVENT LISTENERS
// ==========================================

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('active');
  modalEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function setupEventListeners() {
  // Theme toggle
  dom.themeToggleBtn?.addEventListener('click', toggleTheme);

  // Search input & debouncing
  let searchDebounce;
  dom.searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      state.searchQuery = e.target.value;
      if (dom.clearSearchBtn) {
        dom.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      }
      renderEvents();
    }, 200);
  });

  dom.clearSearchBtn?.addEventListener('click', () => {
    if (dom.searchInput) dom.searchInput.value = '';
    state.searchQuery = '';
    dom.clearSearchBtn.style.display = 'none';
    renderEvents();
  });

  // Sort dropdown
  dom.sortSelect?.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderEvents();
  });

  // My Registrations Button
  dom.myRegistrationsBtn?.addEventListener('click', openMyRegistrationsModal);

  // Mobile navigation drawer toggle
  dom.mobileNavToggle?.addEventListener('click', () => {
    const isExpanded = dom.navLinksWrapper.classList.toggle('nav-open');
    dom.mobileNavToggle.setAttribute('aria-expanded', isExpanded);
  });

  // Close mobile nav when clicking nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      dom.navLinksWrapper?.classList.remove('nav-open');
      dom.mobileNavToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Quick hero CTA buttons
  document.getElementById('hero-explore-btn')?.addEventListener('click', () => {
    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('hero-register-btn')?.addEventListener('click', () => {
    openRegistrationModal();
  });

  // Form Validation & Submit
  if (dom.registerForm) {
    FormValidator.attachLiveValidation(dom.registerForm);
    dom.registerForm.addEventListener('submit', handleRegistrationSubmit);
  }

  // Generic modal close handlers
  document.querySelectorAll('.modal-close-btn, .modal-backdrop-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => closeModal(modal));
    }
  });

  // Newsletter form submission
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.includes('@')) {
      showToast('Thank you for subscribing to event alerts!', 'success');
      newsletterForm.reset();
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  });
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = 'info') {
  if (!dom.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠️',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || '•'}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" type="button" aria-label="Close notification">&times;</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.remove();
  });

  dom.toastContainer.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// CONFETTI CELEBRATION EFFECT (Canvas)
// ==========================================

function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 14,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      gravity: 0.35,
      opacity: 1
    });
  }

  let animationFrame;
  const startTime = Date.now();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.opacity -= 0.008;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive && Date.now() - startTime < 3500) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }

  animate();
}

// Utility: HTML escaping
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
