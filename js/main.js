/**
 * Dimore Architectural Systems - Main Interactive Logic
 * Vanilla JavaScript implementation for navigation, lightbox, filtering,
 * carousel, and enquiry form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initPortfolioFilter();
  initLightbox();
  initReadMoreToggles();
  initTestimonialsCarousel();
  initEnquiryForm();
  initCareerModal();
  initPageContactForm();
  initScrollTop();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. Mobile Menu & Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const mobileSubmenuToggles = document.querySelectorAll('.mobile-dropdown-toggle');

  if (!toggleBtn || !drawer || !backdrop) return;

  function toggleMenu() {
    toggleBtn.classList.toggle('active');
    drawer.classList.toggle('open');
    backdrop.classList.toggle('active');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);

  // Close when clicking any menu link inside drawer
  drawer.querySelectorAll('a:not(.mobile-dropdown-toggle)').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Mobile submenu accordions
  mobileSubmenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const submenu = toggle.nextElementSibling;
      if (submenu) {
        submenu.classList.toggle('show');
        const arrow = toggle.querySelector('.dropdown-arrow');
        if (arrow) {
          arrow.style.transform = submenu.classList.contains('show') ? 'rotate(-135deg)' : 'rotate(45deg)';
        }
      }
    });
  });
}

/* ==========================================================================
   3. Interactive Portfolio Category Filtering
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (!filterBtns.length || !portfolioCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        card.classList.remove('fade-in');
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hide');
          void card.offsetWidth; // Trigger reflow for animation
          card.classList.add('fade-in');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

/* ==========================================================================
   4. Universal Lightbox Modal
   ========================================================================== */
let lightboxItems = [];
let currentLightboxIndex = 0;

function initLightbox() {
  const modal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close-btn');
  const prevBtn = document.querySelector('.lightbox-prev-btn');
  const nextBtn = document.querySelector('.lightbox-next-btn');

  if (!modal || !lightboxImg) return;

  // Gather all triggers from masonry gallery & portfolio cards
  const triggers = document.querySelectorAll('[data-lightbox="true"]');
  lightboxItems = Array.from(triggers).map(el => ({
    src: el.getAttribute('data-src') || el.querySelector('img')?.src || '',
    title: el.getAttribute('data-title') || el.querySelector('img')?.alt || 'Dimore Architectural Window & Door'
  }));

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = lightboxItems[currentLightboxIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxCaption.textContent = `${item.title} (${currentLightboxIndex + 1} / ${lightboxItems.length})`;
  }

  function showNext() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItems.length;
    updateLightboxContent();
  }

  function showPrev() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightboxContent();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   5. Read More / Read Less Toggles for Products
   ========================================================================== */
function initReadMoreToggles() {
  const toggleBtns = document.querySelectorAll('.toggle-read-more');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentWrap = btn.closest('.product-description-wrap');
      const descText = parentWrap ? parentWrap.querySelector('.product-desc-text') : null;

      if (!descText) return;

      const isExpanded = descText.classList.toggle('expanded');
      btn.innerHTML = isExpanded 
        ? 'Read Less <span style="font-size:12px;">▲</span>' 
        : 'Read More <span style="font-size:12px;">▼</span>';
    });
  });
}

/* ==========================================================================
   6. Customer Testimonials Carousel
   ========================================================================== */
function initTestimonialsCarousel() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  // Create dot indicators
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(currentIndex);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 6000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  track.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/* ==========================================================================
   7. Enquiry & Consultation Form Handling
   ========================================================================== */
function initEnquiryForm() {
  const form = document.getElementById('consultation-form');
  const alertBox = document.getElementById('form-alert');
  const submitBtn = document.getElementById('submit-enquiry-btn');

  if (!form || !alertBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name']?.value.trim();
    const phone = form.elements['phone']?.value.trim();
    const email = form.elements['email']?.value.trim();
    const postalCode = form.elements['postal_code']?.value.trim();
    const customerType = form.elements['customer_type']?.value;
    const projectType = form.elements['project_type']?.value;

    // Validation checks
    if (!name) {
      showAlert('Please enter your full name.', 'alert-danger');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
      showAlert('Please enter a valid 10-digit mobile number.', 'alert-danger');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showAlert('Please enter a valid email address.', 'alert-danger');
      return;
    }

    if (!postalCode || postalCode.length < 5) {
      showAlert('Please enter a valid postal code.', 'alert-danger');
      return;
    }

    if (!customerType) {
      showAlert('Please select who you are (Builder, Architect, Home Owner, etc.).', 'alert-danger');
      return;
    }

    if (!projectType) {
      showAlert('Please select what you are looking for (New Construction or Renovation).', 'alert-danger');
      return;
    }

    // Submit animation simulation
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Enquire Now';
      }
      showAlert("Thank you! Your enquiry has been submitted successfully. Our architectural team will contact you within 24 hours.", 'alert-success');
      form.reset();

      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 7000);
    }, 1200);
  });

  function showAlert(msg, typeClass) {
    alertBox.textContent = msg;
    alertBox.className = `form-alert ${typeClass}`;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   8. Scroll To Top
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.querySelector('.btn-scroll-top');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. Career Job Modal & Application Handling
   ========================================================================== */
function initCareerModal() {
  const modalOverlay = document.querySelector('.career-modal-overlay');
  const closeBtn = document.querySelector('.career-modal-close');
  const triggers = document.querySelectorAll('[data-job-id]');

  if (!modalOverlay || !triggers.length) return;

  const jobsData = {
    "2": {
      title: "Front-end Designer",
      location: "Ahmedabad, Gujarat",
      type: "Full Time",
      vacancy: "2 Positions",
      description: "We are seeking a creative and aesthetic-driven Front-end Designer to build luxury digital experiences showcasing Dimore's architectural fenestration systems.",
      requirements: [
        "Proficient in HTML5, CSS3, modern JavaScript, and fluid responsive design systems.",
        "Passionate about luxury brand aesthetics, clean layout hierarchy, and micro-interactions.",
        "Demonstrated understanding of cross-browser compatibility and mobile-first development.",
        "Experience collaborating closely with visual marketing and product design teams."
      ]
    },
    "3": {
      title: "Lead Designer",
      location: "Ahmedabad, Gujarat",
      type: "Full Time",
      vacancy: "1 Position",
      description: "Dimore is looking for a senior Architectural Fenestration Designer to lead technical system detailing, customized profile configurations, and facade integrations.",
      requirements: [
        "Degree in Architecture or Industrial Design with 4+ years in aluminium fenestration/facade design.",
        "High proficiency in AutoCAD, Revit, Rhino, and structural modeling.",
        "In-depth knowledge of aluminium profiles, thermal breaks, and wind-load structural engineering.",
        "Strong team leadership and communication skills to coordinate with technical survey specialists."
      ]
    },
    "4": {
      title: "Sales and Marketing Executive",
      location: "Sindhu Bhavan, Ahmedabad",
      type: "Full Time",
      vacancy: "3 Positions",
      description: "Promote Dimore's high-performance architectural aluminium systems to high-end homeowners, prominent architects, interior designers, and luxury developers.",
      requirements: [
        "2+ years experience in luxury architectural products, building materials, or premium interiors.",
        "Exceptional verbal and written communication skills with strong presentation ability.",
        "Demonstrated consultative selling and long-term client relationship management.",
        "Ability to host architectural walkthroughs at our Sindhu Bhavan Experience Centre."
      ]
    }
  };

  const titleEl = document.getElementById('c-modal-title');
  const typeEl = document.getElementById('c-modal-type');
  const vacancyEl = document.getElementById('c-modal-vacancy');
  const locationEl = document.getElementById('c-modal-location');
  const descEl = document.getElementById('c-modal-desc');
  const reqsEl = document.getElementById('c-modal-reqs');
  const applyRoleInput = document.getElementById('apply-role-input');
  const applyForm = document.getElementById('career-apply-form');
  const applyAlert = document.getElementById('career-apply-alert');

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const jobId = btn.getAttribute('data-job-id');
      const job = jobsData[jobId];

      if (!job) return;

      if (titleEl) titleEl.textContent = job.title;
      if (typeEl) typeEl.textContent = job.type;
      if (vacancyEl) vacancyEl.textContent = job.vacancy;
      if (locationEl) locationEl.textContent = job.location;
      if (descEl) descEl.textContent = job.description;
      if (applyRoleInput) applyRoleInput.value = job.title;

      if (reqsEl) {
        reqsEl.innerHTML = '';
        job.requirements.forEach(req => {
          const li = document.createElement('li');
          li.textContent = req;
          reqsEl.appendChild(li);
        });
      }

      if (applyAlert) applyAlert.style.display = 'none';

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Application form submission inside modal
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = applyForm.elements['applicant_name']?.value.trim();
      const email = applyForm.elements['applicant_email']?.value.trim();
      const phone = applyForm.elements['applicant_phone']?.value.trim();

      if (!name || !email || !phone) {
        showApplyAlert('Please fill out all required fields.', 'alert-danger');
        return;
      }

      const btn = applyForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Submitting...';
      }

      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = 'Submit Application';
        }
        showApplyAlert("Thank you! Your application has been submitted successfully. Our HR team will reach out to you shortly.", 'alert-success');
        applyForm.reset();

        setTimeout(() => {
          closeModal();
        }, 3000);
      }, 1000);
    });
  }

  function showApplyAlert(msg, typeClass) {
    if (!applyAlert) return;
    applyAlert.textContent = msg;
    applyAlert.className = `form-alert ${typeClass}`;
    applyAlert.style.display = 'block';
  }
}

/* ==========================================================================
   10. Contact Us Page Form Handling
   ========================================================================== */
function initPageContactForm() {
  const form = document.getElementById('page-contact-form');
  const alertBox = document.getElementById('page-contact-alert');

  if (!form || !alertBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name']?.value.trim();
    const email = form.elements['email']?.value.trim();
    const phone = form.elements['mobile_no']?.value.trim();
    const city = form.elements['city']?.value.trim();
    const postal = form.elements['postal_code']?.value.trim();

    if (!name || !email || !phone || !city || !postal) {
      showAlert('Please fill in all required fields.', 'alert-danger');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      showAlert('Please enter a valid 10-digit mobile number.', 'alert-danger');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address.', 'alert-danger');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = 'Sending...';
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Send Now &rarr;';
      }
      showAlert("Thank you! Your message has been sent successfully. Our team will contact you within 24 hours.", 'alert-success');
      form.reset();
      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 6000);
    }, 1000);
  });

  function showAlert(msg, typeClass) {
    alertBox.textContent = msg;
    alertBox.className = `form-alert ${typeClass}`;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}


