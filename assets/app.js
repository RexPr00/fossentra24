(function () {
  const body = document.body;
  const drawer = document.querySelector('[data-drawer]');
  const overlay = document.querySelector('[data-overlay]');
  const openDrawerBtn = document.querySelector('[data-open-drawer]');
  const closeDrawerBtn = document.querySelector('[data-close-drawer]');
  const modal = document.querySelector('[data-modal]');
  const modalOpen = document.querySelectorAll('[data-open-modal]');
  const modalClose = document.querySelectorAll('[data-close-modal]');
  const toast = document.querySelector('[data-toast]');

  let focusContext = null;

  function lockScroll(state) {
    body.classList.toggle('locked', state);
  }

  function trapFocus(container) {
    const focusable = container.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    container.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || focusable.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    first && first.focus();
  }

  function openDrawer() {
    if (!drawer || !overlay) return;
    focusContext = document.activeElement;
    drawer.classList.add('open');
    overlay.classList.add('show');
    lockScroll(true);
    trapFocus(drawer);
  }

  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    lockScroll(false);
    focusContext && focusContext.focus();
  }

  function openModal() {
    if (!modal || !overlay) return;
    focusContext = document.activeElement;
    modal.classList.add('show');
    overlay.classList.add('show');
    lockScroll(true);
    const panel = modal.querySelector('.modal-panel');
    panel && trapFocus(panel);
  }

  function closeModal() {
    if (!modal || !overlay) return;
    modal.classList.remove('show');
    overlay.classList.remove('show');
    lockScroll(false);
    focusContext && focusContext.focus();
  }

  openDrawerBtn && openDrawerBtn.addEventListener('click', openDrawer);
  closeDrawerBtn && closeDrawerBtn.addEventListener('click', closeDrawer);
  overlay && overlay.addEventListener('click', function () {
    closeDrawer();
    closeModal();
  });

  modalOpen.forEach(btn => btn.addEventListener('click', openModal));
  modalClose.forEach(btn => btn.addEventListener('click', closeModal));

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
  });

  const reveals = document.querySelectorAll('.reveal');
  const bars = document.querySelectorAll('.bar');
  const counters = document.querySelectorAll('[data-counter]');

  const observer = new IntersectionObserver((entries, ob) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      if (entry.target.classList.contains('bar')) {
        entry.target.style.width = entry.target.dataset.width || '70%';
      }

      if (entry.target.dataset.counter) {
        const end = Number(entry.target.dataset.counter);
        let start = 0;
        const step = Math.max(1, Math.round(end / 40));
        const timer = setInterval(() => {
          start += step;
          if (start >= end) {
            start = end;
            clearInterval(timer);
          }
          entry.target.textContent = `${start}${entry.target.dataset.suffix || ''}`;
        }, 35);
      }
      ob.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  reveals.forEach(node => observer.observe(node));
  bars.forEach(node => observer.observe(node));
  counters.forEach(node => observer.observe(node));

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    btn && btn.addEventListener('click', function () {
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });

  function validateForm(form) {
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    let ok = true;

    [name, email, phone].forEach(input => input && (input.style.borderColor = ''));

    if (!name.value.trim() || name.value.trim().length < 3) {
      ok = false;
      name.style.borderColor = '#ff6b6b';
    }
    if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
      ok = false;
      email.style.borderColor = '#ff6b6b';
    }
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(phone.value.trim())) {
      ok = false;
      phone.style.borderColor = '#ff6b6b';
    }
    return ok;
  }

  document.querySelectorAll('.lead-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) return;
      form.reset();
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3200);
      }
    });
  });
})();
