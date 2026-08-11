/**
 * NARENDRA DENTAL CLINIC - INTERACTIVE APPLICATION SCRIPT
 * Location: PJ Extension, Davangere, Karnataka
 * Features: Live Opening Hours, Appointment Scheduler, Package Estimator, Reviews, FAQs
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Modules
  initLiveHours();
  initServiceFilters();
  initServiceModals();
  initPackageEstimator();
  initBookingSystem();
  initReviews();
  initFAQAccordion();
  initMobileMenu();
});

/* ==========================================================================
   1. LIVE OPEN/CLOSED STATUS CALCULATOR
   Hours: Monday - Saturday (10:00 AM - 8:00 PM) | Sunday: Closed
   ========================================================================== */
function initLiveHours() {
  const statusContainers = document.querySelectorAll('.live-status-target');
  if (!statusContainers.length) return;

  function checkStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;

    const openTime = 10 * 60;  // 10:00 AM = 600 min
    const closeTime = 20 * 60; // 8:00 PM = 1200 min

    let isOpen = false;
    let statusText = '';
    let badgeClass = '';

    if (day === 0) {
      // Sunday Closed
      isOpen = false;
      statusText = 'CLOSED NOW • Opens Mon at 10:00 AM';
      badgeClass = 'status-closed';
    } else if (currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime) {
      // Open Monday-Saturday
      isOpen = true;
      statusText = 'OPEN NOW • Today till 8:00 PM';
      badgeClass = 'status-open';
    } else if (currentTimeInMinutes < openTime) {
      isOpen = false;
      statusText = 'CLOSED NOW • Opens Today at 10:00 AM';
      badgeClass = 'status-closed';
    } else {
      isOpen = false;
      const nextDay = (day === 6) ? 'Mon' : 'Tomorrow';
      statusText = `CLOSED NOW • Opens ${nextDay} at 10:00 AM`;
      badgeClass = 'status-closed';
    }

    statusContainers.forEach(container => {
      container.className = `status-pill ${badgeClass}`;
      container.innerHTML = `<span class="status-indicator"></span> <span>${statusText}</span>`;
    });
  }

  checkStatus();
  setInterval(checkStatus, 60000); // Re-check every minute
}

/* ==========================================================================
   2. SERVICE FILTERS & TREATMENT DETAILS MODAL
   ======================================================================const TREATMENTS_DATA = {
  rootcanal: {
    title: 'Root Canal Treatment (RCT)',
    icon: 'fa-tooth',
    image: 'images/root_canal.jpg',
    category: 'General & Restorative',
    duration: '45 - 60 Mins',
    sessions: '1 - 2 Visits',
    description: 'Advanced endodontic procedure designed to save infected or severely damaged teeth. Utilizing rotary endodontic instruments and digital apex locators to ensure painless, precise treatment.',
    highlights: [
      'Painless Single-Visit or Two-Visit RCT',
      'Rotary Endodontics for minimal discomfort',
      'Biocompatible gutta-percha seal',
      'Custom Zirconia or PFM Dental Crown placement'
    ],
    priceRange: '₹2,500 - ₹5,500'
  },
  implants: {
    title: 'Dental Implants & Restoration',
    icon: 'fa-teeth-open',
    image: 'images/dental_implants.jpg',
    category: 'Dental Surgery & Implants',
    duration: '60 Mins',
    sessions: 'Multi-stage',
    description: 'Permanent, titanium dental implants that mimic natural tooth roots. Provides seamless, lifetime replacement for missing single or multiple teeth with optimal chewing efficiency.',
    highlights: [
      'US-FDA approved titanium implants',
      'Natural aesthetic crown matching',
      'Preserves adjacent tooth structure',
      'Restores full biting force & confidence'
    ],
    priceRange: '₹18,000 - ₹35,000'
  },
  cosmetic: {
    title: 'Teeth Whitening & Smile Design',
    icon: 'fa-wand-magic-sparkles',
    image: 'images/teeth_whitening.jpg',
    category: 'Cosmetic Dentistry',
    duration: '45 Mins',
    sessions: 'Single Visit',
    description: 'Professional in-office laser teeth whitening and cosmetic veneer solutions to remove deep enamel stains, yellowing, and minor misalignment for a radiant smile.',
    highlights: [
      'Up to 6-8 shades brighter in one sitting',
      'Safe enamel-protective whitening agents',
      'Custom porcelain veneers & smile design',
      'Long-lasting stain resistance tips'
    ],
    priceRange: '₹3,500 - ₹12,000'
  },
  orthodontics: {
    title: 'Braces & Clear Aligners',
    icon: 'fa-diagram-project',
    image: 'images/braces.jpg',
    category: 'Orthodontics',
    duration: 'Monthly Checks',
    sessions: '6 - 18 Months',
    description: 'Straighten crooked, crowded, or gapped teeth with traditional ceramic/metal braces or comfortable transparent clear aligners suitable for teens and adults.',
    highlights: [
      'Invisible Clear Aligners & Metal Braces',
      'Corrects overbites, underbites & spacing',
      'Custom 3D treatment planning',
      'Easy flexible monthly installment options'
    ],
    priceRange: '₹20,000 - ₹65,000'
  },
  pediatric: {
    title: 'Pediatric Dental Care',
    icon: 'fa-child-reaching',
    image: 'images/pediatric_care.jpg',
    category: 'Pediatric Dentistry',
    duration: '30 Mins',
    sessions: 'Single Visit',
    description: 'Gentle, child-friendly dental care tailored to kids. Treatments include fluoride therapy, pit and fissure sealants, habit breaking appliances, and painless cavity fillings.',
    highlights: [
      'Friendly anxiety-free environment',
      'Fluoride varnish for decay protection',
      'Pit & fissure tooth sealants',
      'Oral hygiene habit counseling'
    ],
    priceRange: '₹800 - ₹2,500'
  },
  scaling: {
    title: 'Ultrasonic Scaling & Polishing',
    icon: 'fa-pump-soap',
    image: 'images/scaling_polishing.jpg',
    category: 'Preventive Care',
    duration: '30 - 45 Mins',
    sessions: 'Single Visit',
    description: 'Thorough removal of stubborn dental tartar, plaque, and bacterial biofilms using ultrasonic tech, followed by polishing to protect gums against gingivitis.',
    highlights: [
      'Removes tough tobacco & coffee stains',
      'Prevents bleeding gums & bad breath',
      'Non-invasive ultrasonic cleaning',
      'Recommended twice yearly for hygiene'
    ],
    priceRange: '₹900 - ₹1,800'
  }
};

function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.classList.add('fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initServiceModals() {
  const modalOverlay = document.getElementById('serviceModal');
  const modalBody = document.getElementById('serviceModalBody');
  const closeModalBtn = document.getElementById('closeServiceModal');

  if (!modalOverlay || !modalBody) return;

  document.querySelectorAll('.open-treatment-modal').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const key = trigger.getAttribute('data-treatment');
      const data = TREATMENTS_DATA[key];

      if (data) {
        modalBody.innerHTML = `
          ${data.image ? `<div style="width:100%; height:200px; border-radius: var(--radius-sm); overflow:hidden; margin-bottom: 20px;"><img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;"></div>` : ''}
          <div class="service-header" style="margin-bottom: 16px;">
            <div class="service-icon-box">
              <i class="fa-solid ${data.icon}"></i>
            </div>
            <div>
              <span class="badge-tag">${data.category}</span>
              <h2 style="font-size: 1.6rem; color: var(--primary-navy); margin-top: 4px;">${data.title}</h2>
            </div>
          </div>

          <div style="display: flex; gap: 16px; margin: 16px 0; background: var(--bg-alt); padding: 12px 16px; border-radius: var(--radius-sm);">
            <div><strong>Est. Time:</strong> ${data.duration}</div>
            <div><strong>Visits:</strong> ${data.sessions}</div>
            <div><strong>Est. Fee:</strong> <span style="color: var(--teal-dark); font-weight: 700;">${data.priceRange}</span></div>
          </div>

          <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 20px; line-height: 1.6;">${data.description}</p>

          <h4 style="color: var(--primary-navy); margin-bottom: 12px;">Key Benefits & Procedure Highlights:</h4>
          <ul class="service-highlights" style="margin-bottom: 24px;">
            ${data.highlights.map(h => `<li><i class="fa-solid fa-circle-check"></i> ${h}</li>`).join('')}
          </ul>`/li>`).join('')}
          </ul>

          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn btn-outline btn-sm" id="modalCloseBtn">Close</button>
            <button class="btn btn-primary btn-sm" onclick="closeServiceModalAndBook('${data.title}')">
              <i class="fa-solid fa-calendar-check"></i> Book Treatment
            </button>
          </div>
        `;

        modalOverlay.classList.add('active');

        document.getElementById('modalCloseBtn')?.addEventListener('click', () => {
          modalOverlay.classList.remove('active');
        });
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

window.closeServiceModalAndBook = function(serviceName) {
  const modalOverlay = document.getElementById('serviceModal');
  if (modalOverlay) modalOverlay.classList.remove('active');

  const serviceSelect = document.getElementById('bookingService');
  if (serviceSelect) {
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].text.includes(serviceName) || serviceName.includes(serviceSelect.options[i].value)) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }

  const bookingSection = document.getElementById('booking');
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
  }
};

/* ==========================================================================
   3. PACKAGE ESTIMATOR TOOL
   ========================================================================== */
const PACKAGES_DATA = {
  preventive: {
    title: 'Basic Preventive Care',
    price: '₹1,199',
    features: [
      'Comprehensive Oral Examination',
      'Ultrasonic Scaling & Polishing',
      'Digital Intraoral X-Ray (1 view)',
      'Customized Hygiene Consultation'
    ]
  },
  rct: {
    title: 'Root Canal & Crown Combo',
    price: '₹4,499',
    features: [
      'Painless Single/Multi Rotary RCT',
      'Digital Apex Location & X-Rays',
      'High-Grade Ceramic Crown Placement',
      '1-Year Guarantee on Restoration'
    ]
  },
  whitening: {
    title: 'Smile Makeover Special',
    price: '₹8,999',
    features: [
      'Laser Teeth Whitening (up to 8 shades)',
      'Full Mouth Scaling & Stain Removal',
      'Enamel Protection Fluoride Shield',
      'Free Home Care Whitening Kit'
    ]
  },
  family: {
    title: 'Family Dental Health Shield',
    price: '₹2,999',
    features: [
      'Checkups for up to 4 Family Members',
      'Scaling & Cleaning for 2 Adults',
      'Pediatric Fluoride Treatment for 2 Kids',
      '15% Off on Future Dental Procedures'
    ]
  }
};

function initPackageEstimator() {
  const packageCards = document.querySelectorAll('.package-option-card');
  const amountEl = document.getElementById('estAmount');
  const detailsList = document.getElementById('estDetailsList');
  const bookPkgBtn = document.getElementById('bookSelectedPackage');

  if (!packageCards.length || !amountEl || !detailsList) return;

  let currentKey = 'preventive';

  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      packageCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      currentKey = card.getAttribute('data-package');
      const data = PACKAGES_DATA[currentKey];

      if (data) {
        amountEl.textContent = data.price;
        detailsList.innerHTML = data.features.map(f => `<li><i class="fa-solid fa-check-circle"></i> ${f}</li>`).join('');
      }
    });
  });

  if (bookPkgBtn) {
    bookPkgBtn.addEventListener('click', () => {
      const data = PACKAGES_DATA[currentKey];
      if (data) {
        window.closeServiceModalAndBook(data.title);
      }
    });
  }
}

/* ==========================================================================
   4. ONLINE APPOINTMENT SCHEDULER SYSTEM
   ========================================================================== */
function initBookingSystem() {
  const dateInput = document.getElementById('bookingDate');
  const slotsContainer = document.getElementById('timeSlotsContainer');
  const bookingForm = document.getElementById('appointmentForm');

  if (!dateInput || !slotsContainer || !bookingForm) return;

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  dateInput.value = today;

  let selectedTimeSlot = '';

  function generateSlots(selectedDateStr) {
    slotsContainer.innerHTML = '';
    selectedTimeSlot = '';

    const selectedDate = new Date(selectedDateStr);
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek === 0) {
      slotsContainer.innerHTML = `<p style="color: #ef4444; font-size: 0.9rem; grid-column: 1/-1;">Clinic is Closed on Sundays. Please choose Monday to Saturday.</p>`;
      return;
    }

    // Generate slots 10:00 AM to 7:30 PM
    const times = [
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '04:00 PM', '04:30 PM',
      '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
      '07:00 PM', '07:30 PM'
    ];

    times.forEach(time => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-btn';
      btn.textContent = time;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTimeSlot = time;
      });

      slotsContainer.appendChild(btn);
    });
  }

  generateSlots(today);

  dateInput.addEventListener('change', (e) => {
    generateSlots(e.target.value);
  });

  // Handle Form Submit
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const service = document.getElementById('bookingService').value;
    const date = dateInput.value;

    if (!name || !phone || !service) {
      alert('Please fill out all required patient details.');
      return;
    }

    if (!selectedTimeSlot) {
      alert('Please select a preferred time slot for your appointment.');
      return;
    }

    // Generate Reference Code
    const refCode = 'NDC-' + Math.floor(1000 + Math.random() * 9000);

    // Show Confirmation Ticket Modal
    showBookingConfirmationModal({
      refCode,
      name,
      phone,
      service,
      date,
      time: selectedTimeSlot
    });
  });
}

function showBookingConfirmationModal(data) {
  const modalOverlay = document.getElementById('confirmationModal');
  const modalBody = document.getElementById('confirmationModalBody');

  if (!modalOverlay || !modalBody) return;

  const whatsappMessage = encodeURIComponent(
    `Hello Narendra Dental Clinic,\nI have scheduled an appointment via your website:\n` +
    `• Ref Code: ${data.refCode}\n` +
    `• Patient: ${data.name}\n` +
    `• Phone: ${data.phone}\n` +
    `• Service: ${data.service}\n` +
    `• Date & Time: ${data.date} at ${data.time}\n` +
    `Please confirm my slot.`
  );

  const whatsappUrl = `https://wa.me/919725849389?text=${whatsappMessage}`;

  modalBody.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 60px; height: 60px; background: var(--teal-soft); color: var(--teal-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 16px auto;">
        <i class="fa-solid fa-calendar-check"></i>
      </div>
      <h3 style="font-size: 1.5rem; color: var(--primary-navy); margin-bottom: 6px;">Appointment Scheduled!</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem;">Thank you ${data.name}. We look forward to seeing you at Narendra Dental Clinic in Davangere.</p>

      <div class="ticket-box">
        <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Booking Reference ID</div>
        <div class="ticket-ref">${data.refCode}</div>
        <div style="font-size: 0.95rem; color: var(--primary-navy); font-weight: 600; margin-top: 8px;">
          ${data.service}<br>
          <span style="color: var(--teal-dark);">${data.date} @ ${data.time}</span>
        </div>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">
        Location: 7th Cross, PJ Extension, Davanagere, Karnataka 577002.<br>
        Direct Helpline: <strong>09725849389</strong>
      </p>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp">
          <i class="fa-brands fa-whatsapp" style="font-size: 1.2rem;"></i> Confirm via WhatsApp Now
        </a>
        <button class="btn btn-outline" id="closeTicketModal">Close & Return to Site</button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');

  document.getElementById('closeTicketModal')?.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    document.getElementById('appointmentForm').reset();
  });
}

/* ==========================================================================
   5. REVIEWS & TESTIMONIAL SYSTEM
   ========================================================================== */
function initReviews() {
  const reviewForm = document.getElementById('addReviewForm');
  const reviewsGrid = document.getElementById('reviewsGrid');

  if (!reviewForm || !reviewsGrid) return;

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewerName').value.trim();
    const comment = document.getElementById('reviewerComment').value.trim();
    const rating = document.getElementById('reviewerRating').value;

    if (!name || !comment) return;

    const starsHtml = '★'.repeat(rating) + '☆'.repeat(5 - rating);

    const newCard = document.createElement('div');
    newCard.className = 'review-card fadeIn';
    newCard.innerHTML = `
      <div>
        <div class="review-author">
          <div class="author-avatar">${name.charAt(0).toUpperCase()}</div>
          <div class="author-info">
            <h4>${name}</h4>
            <span>Davangere Resident</span>
          </div>
        </div>
        <div class="rating-stars">${starsHtml}</div>
        <p class="review-text">"${comment}"</p>
      </div>
      <div class="review-date">Verified Patient • Just Now</div>
    `;

    reviewsGrid.prepend(newCard);
    reviewForm.reset();
    alert('Thank you for sharing your review with Narendra Dental Clinic!');
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. MOBILE NAVIGATION TOGGLE & SMOOTH SCROLL
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });
}
