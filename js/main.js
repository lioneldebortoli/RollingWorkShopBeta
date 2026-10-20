/**
 * main.js — Rolling Code Workshop Landing
 * Validación de formularios, selector de entradas, contador de cantidad
 * y actualización del resumen del pedido.
 */
(function () {
  'use strict';

  // ========================================
  // Ticket selection
  // ========================================
  const ticketOptions = document.querySelectorAll('.ticket-option');
  const qtyValue = document.getElementById('qty-value');
  const btnMinus = document.getElementById('btn-minus');
  const btnPlus = document.getElementById('btn-plus');
  const btnContinue = document.getElementById('btn-continue');

  // Summary elements
  const summaryTicketName = document.getElementById('summary-ticket-name');
  const summaryTicketPrice = document.getElementById('summary-ticket-price');
  const summaryService = document.getElementById('summary-service');
  const summaryTotal = document.getElementById('summary-total');

  // Ticket data
  const ticketPrices = {
    'early-bird': { name: 'Early Bird', price: 25000 },
    general: { name: 'General', price: 35000 },
    virtual: { name: 'Virtual', price: 15000 },
  };

  let selectedTicket = 'early-bird';
  let quantity = 1;

  /** Format number as Argentine currency */
  function formatPrice(n) {
    return '$' + n.toLocaleString('es-AR');
  }

  /** Update the order summary */
  function updateSummary() {
    const ticket = ticketPrices[selectedTicket];
    const subtotal = ticket.price * quantity;
    const service = Math.round(subtotal * 0.05);
    const total = subtotal + service;

    if (summaryTicketName) {
      summaryTicketName.textContent =
        quantity + ' entrada ' + ticket.name;
    }
    if (summaryTicketPrice) summaryTicketPrice.textContent = formatPrice(subtotal);
    if (summaryService) summaryService.textContent = formatPrice(service);
    if (summaryTotal) summaryTotal.textContent = formatPrice(total);
  }

  // Handle ticket option click
  ticketOptions.forEach(function (opt) {
    opt.addEventListener('click', function () {
      ticketOptions.forEach(function (o) {
        o.classList.remove('selected');
      });
      opt.classList.add('selected');
      selectedTicket = opt.dataset.ticket;
      updateSummary();

      // Clear any validation error
      var errEl = document.getElementById('ticket-error');
      if (errEl) errEl.classList.remove('show');
    });
  });

  // Quantity controls
  if (btnMinus) {
    btnMinus.addEventListener('click', function () {
      if (quantity > 1) {
        quantity--;
        qtyValue.textContent = quantity;
        updateSummary();
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', function () {
      if (quantity < 10) {
        quantity++;
        qtyValue.textContent = quantity;
        updateSummary();
      }
    });
  }

  // Initialize summary
  updateSummary();

  // ========================================
  // Checkout Step 1 validation
  // ========================================
  if (btnContinue) {
    btnContinue.addEventListener('click', function (e) {
      e.preventDefault();

      // Check that a ticket is selected
      var hasSelection = document.querySelector('.ticket-option.selected');
      var errEl = document.getElementById('ticket-error');

      if (!hasSelection) {
        if (errEl) errEl.classList.add('show');
        return;
      }

      if (quantity < 1 || quantity > 10) {
        if (errEl) {
          errEl.textContent = 'La cantidad debe ser entre 1 y 10.';
          errEl.classList.add('show');
        }
        return;
      }

      // All good — open modal
      var modal = new bootstrap.Modal(document.getElementById('modalDatos'));
      modal.show();
    });
  }

  // ========================================
  // Modal form validation
  // ========================================
  var modalForm = document.getElementById('form-datos');

  if (modalForm) {
    // Real-time feedback: remove error once corrected
    modalForm.querySelectorAll('.form-control-rc').forEach(function (input) {
      input.addEventListener('input', function () {
        if (this.checkValidity()) {
          this.classList.remove('is-invalid');
          this.classList.add('is-valid');
        } else if (this.classList.contains('is-valid') || modalForm.classList.contains('was-validated')) {
          this.classList.remove('is-valid');
          this.classList.add('is-invalid');
        }
      });
    });

    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Custom validation for each field
      var nombre = document.getElementById('input-nombre');
      var apellido = document.getElementById('input-apellido');
      var email = document.getElementById('input-email');
      var telefono = document.getElementById('input-telefono');

      var isValid = true;

      // Nombre: solo letras y espacios, mín 2
      var nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,}$/;
      if (!nombre.value.trim() || !nameRegex.test(nombre.value.trim())) {
        nombre.classList.add('is-invalid');
        nombre.classList.remove('is-valid');
        isValid = false;
      } else {
        nombre.classList.remove('is-invalid');
        nombre.classList.add('is-valid');
      }

      // Apellido
      if (!apellido.value.trim() || !nameRegex.test(apellido.value.trim())) {
        apellido.classList.add('is-invalid');
        apellido.classList.remove('is-valid');
        isValid = false;
      } else {
        apellido.classList.remove('is-invalid');
        apellido.classList.add('is-valid');
      }

      // Email
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        email.classList.add('is-invalid');
        email.classList.remove('is-valid');
        isValid = false;
      } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
      }

      // Teléfono: solo números, 8 a 13 dígitos
      var phoneRegex = /^\d{8,13}$/;
      if (!telefono.value.trim() || !phoneRegex.test(telefono.value.trim())) {
        telefono.classList.add('is-invalid');
        telefono.classList.remove('is-valid');
        isValid = false;
      } else {
        telefono.classList.remove('is-invalid');
        telefono.classList.add('is-valid');
      }

      if (!isValid) {
        modalForm.classList.add('was-validated');
        return;
      }

      // Success — close modal and show alert
      var modalEl = document.getElementById('modalDatos');
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      alert('¡Registro exitoso! Te enviaremos la entrada por email.');

      // Reset
      modalForm.reset();
      modalForm.classList.remove('was-validated');
      modalForm.querySelectorAll('.form-control-rc').forEach(function (input) {
        input.classList.remove('is-valid', 'is-invalid');
      });
    });
  }

  // ========================================
  // Smooth scroll for nav links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        // Close mobile menu if open
        var navCollapse = document.getElementById('navbarMain');
        if (navCollapse && navCollapse.classList.contains('show')) {
          var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });
})();
