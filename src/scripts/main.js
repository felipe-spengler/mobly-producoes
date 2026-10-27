/* ==========================================================================
   MOBLY PRODUÇÕES 3.0 — INTERACTIVE CLIENT SCRIPT
   High-end cinema interactions, video modals, HUD timecode, quote calculator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initVideoPlayerModal();
  initPortfolioFilter();
  initLightbox();
  initPricingTabs();
  initSimulator();
  initFaqAccordion();
});
/* --------------------------------------------------------------------------
   Header Scroll & Mobile Menu
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  function closeMenu() {
    drawer?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  function openMenu() {
    drawer?.classList.add('open');
    menuBtn?.setAttribute('aria-expanded', 'true');
    menuBtn?.classList.add('active');
    document.body.classList.add('menu-open');
  }

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Video Showcase & Cinema Modal Player
   -------------------------------------------------------------------------- */
function initVideoPlayerModal() {
  const modal = document.getElementById('cinemaModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalVideoTitle');
  const closeBtn = document.getElementById('closeModalBtn');
  const modalWhatsapp = document.getElementById('modalWhatsappBtn');
  const videoCards = document.querySelectorAll('.video-card');
  const heroPlayBtn = document.getElementById('heroPlayBtn');

  // Video hover preview & click actions
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    if (video) {
      card.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 992) {
          video.play().catch(() => {});
        }
      });
      card.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 992) {
          video.pause();
          video.currentTime = 0;
        }
      });
    }

    const handleCardAction = () => {
      const whatsappMsg = card.getAttribute('data-whatsapp-msg');
      if (whatsappMsg) {
        const url = `https://wa.me/5564981346985?text=${encodeURIComponent(whatsappMsg)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
      const src = card.getAttribute('data-video-src');
      if (src) {
        const title = card.getAttribute('data-video-title') || 'Vídeo Mobly';
        openCinemaModal(src, title);
      }
    };

    card.addEventListener('click', handleCardAction);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardAction();
      }
    });
  });

  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', () => {
      const target = document.getElementById('videos');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function openCinemaModal(src, title) {
    if (!modal || !modalVideo) return;
    modalVideo.src = src;
    if (modalTitle) modalTitle.textContent = title;
    if (modalWhatsapp) {
      const text = encodeURIComponent(`Olá Débora! Adorei o vídeo "${title}" no site da Mobly e gostaria de solicitar um orçamento para meu projeto.`);
      modalWhatsapp.href = `https://wa.me/5564981346985?text=${text}`;
    }
    modal.classList.add('open');
    modalVideo.play().catch(() => {});
    document.body.style.overflow = 'hidden';
  }

  function closeCinemaModal() {
    if (!modal || !modalVideo) return;
    modal.classList.remove('open');
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = '';
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCinemaModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCinemaModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeCinemaModal();
    }
  });
}

/* --------------------------------------------------------------------------
   Portfolio Filter Tabs
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Image Lightbox
   -------------------------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('closeLightboxBtn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   Pricing Tabs (Social Media | Vídeo | Edição)
   -------------------------------------------------------------------------- */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing-tab');
  const panes = document.querySelectorAll('.pricing-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panes.forEach(pane => {
        if (pane.id === `tab-${target}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Interactive WhatsApp Budget Simulator
   -------------------------------------------------------------------------- */
function initSimulator() {
  const serviceRadios = document.querySelectorAll('input[name="sim-service"]');
  const addonCheckboxes = document.querySelectorAll('input[name="sim-addon"]');
  const estimateDisplay = document.getElementById('simEstimateDisplay');
  const estimateBreakdown = document.getElementById('simBreakdown');
  const sendBtn = document.getElementById('simSendWhatsapp');

  if (!serviceRadios.length || !estimateDisplay) return;

  function updateCalculation() {
    let basePrice = 0;
    let selectedServiceName = '';

    const selectedService = document.querySelector('input[name="sim-service"]:checked');
    if (selectedService) {
      basePrice = parseInt(selectedService.value, 10) || 0;
      selectedServiceName = selectedService.getAttribute('data-name') || '';
    }

    // Highlight labels
    serviceRadios.forEach(radio => {
      const parentLabel = radio.closest('.sim-option-label');
      if (parentLabel) {
        if (radio.checked) parentLabel.classList.add('checked');
        else parentLabel.classList.remove('checked');
      }
    });

    let addonsTotal = 0;
    const selectedAddons = [];

    addonCheckboxes.forEach(checkbox => {
      const parentLabel = checkbox.closest('.sim-option-label');
      if (checkbox.checked) {
        if (parentLabel) parentLabel.classList.add('checked');
        addonsTotal += parseInt(checkbox.value, 10) || 0;
        selectedAddons.push(checkbox.getAttribute('data-name'));
      } else {
        if (parentLabel) parentLabel.classList.remove('checked');
      }
    });

    const total = basePrice + addonsTotal;
    estimateDisplay.textContent = `R$ ${total.toLocaleString('pt-BR')}`;

    if (estimateBreakdown) {
      estimateBreakdown.innerHTML = `
        <div><strong>Serviço selecionado:</strong> ${selectedServiceName}</div>
        ${selectedAddons.length ? `<div><strong>Opcionais:</strong> ${selectedAddons.join(', ')}</div>` : '<div><strong>Opcionais:</strong> Nenhum selecionado</div>'}
        <div style="font-size:0.75rem; color:var(--color-cream-muted); margin-top:0.35rem;">
          *Estimativa base para Goiânia e região. Valores sujeitos a confirmação de data e escopo detalhado.
        </div>
      `;
    }

    if (sendBtn) {
      const msg = [
        `Olá Débora! Fiz uma simulação no site da Mobly:`,
        `• Serviço: ${selectedServiceName}`,
        selectedAddons.length ? `• Opcionais: ${selectedAddons.join(', ')}` : '',
        `• Estimativa calculada: R$ ${total.toLocaleString('pt-BR')}`,
        ``,
        `Gostaria de verificar disponibilidade de agenda e fechar os detalhes!`
      ].filter(Boolean).join('\n');

      sendBtn.href = `https://wa.me/5564981346985?text=${encodeURIComponent(msg)}`;
    }
  }

  serviceRadios.forEach(r => r.addEventListener('change', updateCalculation));
  addonCheckboxes.forEach(c => c.addEventListener('change', updateCalculation));

  updateCalculation();
}

/* --------------------------------------------------------------------------
   FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });
}
