/* ==========================================================================
   PÁGINA 0: LOGIN (USUARIO / ADMINISTRADOR) – VALIDACIONES CON jQUERY
   - Selector $() + eventos .on() / .click()
   - Efectos: slideDown / slideUp / fadeIn / animate (shake)
   - Reto PRO: addClass / removeClass para cambiar el degradado temático
     del contenedor y .html() para cambiar el ícono principal sin recargar.
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  const MAX_ATTEMPTS = 3;
  const LOCK_SECONDS = 30;
  let failedAttempts = 0;
  let lockUntil = 0;
  let lockTimer = null;
  let currentRole = 'usuario';

  const ICON_ADMIN = () => `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>`;

  const ICON_MAIL = () => `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
    </svg>`;

  const ICON_LOCK = () => `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>`;

  const ICON_EYE = (open) =>
    open
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19"/><path d="M1 1l22 22"/></svg>`;

  // Configuración temática por rol (Reto PRO)
  const ROLE_THEMES = {
    usuario: {
      themeClass: 'login-theme--usuario',
      icon: () => PC.icons.navProfile(),
      title: 'Acceso Cliente',
      desc: 'Explora el menú, guarda favoritos y tus selecciones',
      demo: 'Demo cliente: cliente@planetchicken.bo · Cliente123',
      cta: 'INGRESAR',
    },
    admin: {
      themeClass: 'login-theme--admin',
      icon: ICON_ADMIN,
      title: 'Acceso Administrador',
      desc: 'Gestión del catálogo y promociones del negocio',
      demo: 'Demo admin: admin@planetchicken.bo · Admin123',
      cta: 'INGRESAR COMO ADMIN',
    },
  };

  /* ---------------------------- Reglas de validación ---------------------------- */
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  function validateEmail(value, role) {
    const v = value.trim();
    if (!v) return 'El correo electrónico es obligatorio.';
    if (/\s/.test(value.trim())) return 'El correo no debe contener espacios.';
    if (v.length > 60) return 'El correo no puede superar 60 caracteres.';
    if (!EMAIL_REGEX.test(v)) return 'Ingresa un correo válido (ej. nombre@dominio.com).';
    if (role === 'admin' && !/@planetchicken\.bo$/i.test(v)) {
      return 'El administrador debe usar su correo corporativo @planetchicken.bo.';
    }
    return '';
  }

  function validatePassword(value) {
    if (!value) return 'La contraseña es obligatoria.';
    if (/\s/.test(value)) return 'La contraseña no debe contener espacios.';
    if (value.length < 8) return 'La contraseña debe tener mínimo 8 caracteres.';
    if (value.length > 30) return 'La contraseña no puede superar 30 caracteres.';
    if (!/[A-Z]/.test(value)) return 'Debe incluir al menos una letra mayúscula.';
    if (!/[a-z]/.test(value)) return 'Debe incluir al menos una letra minúscula.';
    if (!/[0-9]/.test(value)) return 'Debe incluir al menos un número.';
    return '';
  }

  /* ---------------------------- Helpers de UI (jQuery) ---------------------------- */
  function setFieldState($field, message) {
    const $error = $field.find('.login-error');
    if (message) {
      $field.removeClass('is-valid').addClass('is-invalid');
      $field.find('input').attr('aria-invalid', 'true');
      $error.text(message);
      if (!$error.is(':visible')) $error.stop(true, true).slideDown('fast');
    } else {
      $field.removeClass('is-invalid').addClass('is-valid');
      $field.find('input').attr('aria-invalid', 'false');
      $error.stop(true, true).slideUp('fast');
    }
  }

  function clearFieldState($field) {
    $field.removeClass('is-invalid is-valid');
    $field.find('input').removeAttr('aria-invalid');
    $field.find('.login-error').stop(true, true).slideUp('fast');
  }

  function showFormError(message) {
    $('#login-form-error').text(message).stop(true, true).hide().fadeIn(220);
  }

  function hideFormError() {
    $('#login-form-error').stop(true, true).fadeOut(150);
  }

  function shakeCard() {
    const $card = $('#login-form');
    $card
      .stop(true, true)
      .animate({ left: -10 }, 60)
      .animate({ left: 10 }, 60)
      .animate({ left: -6 }, 60)
      .animate({ left: 6 }, 60)
      .animate({ left: 0 }, 60);
  }

  function runEmail() {
    const msg = validateEmail($('#login-email').val(), currentRole);
    setFieldState($('#field-email'), msg);
    return msg;
  }

  function runPassword() {
    const msg = validatePassword($('#login-password').val());
    setFieldState($('#field-password'), msg);
    return msg;
  }

  /* ---------------------------- Reto PRO: cambio de temática ---------------------------- */
  function applyRole(role) {
    currentRole = role;
    const cfg = ROLE_THEMES[role];
    const $screen = $('#login-screen');

    // Cambia la clase del contenedor para aplicar el degradado temático
    $screen.removeClass('login-theme--usuario login-theme--admin').addClass(cfg.themeClass);

    // Cambia el ícono principal con .html() sin recargar la página
    $('#login-role-icon').hide().html(cfg.icon()).fadeIn(250);
    $('#login-role-title').text(cfg.title);
    $('#login-role-desc').text(cfg.desc);
    $('#login-demo-hint').text(cfg.demo);
    $('#login-submit-label').text(cfg.cta);

    $('.login-role-btn')
      .removeClass('is-active')
      .attr('aria-checked', 'false')
      .filter(`[data-role="${role}"]`)
      .addClass('is-active')
      .attr('aria-checked', 'true');

    hideFormError();
    // Re-validar el correo si ya fue escrito (la regla cambia según el rol)
    if ($('#login-email').val().trim()) runEmail();
  }

  /* ---------------------------- Bloqueo por intentos ---------------------------- */
  function startLockCountdown() {
    const $btn = $('#login-submit');
    clearInterval(lockTimer);

    const tick = () => {
      const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(lockTimer);
        lockTimer = null;
        failedAttempts = 0;
        $btn.prop('disabled', false);
        $('#login-submit-label').text(ROLE_THEMES[currentRole].cta);
        hideFormError();
        return;
      }
      $btn.prop('disabled', true);
      $('#login-submit-label').text(`BLOQUEADO (${remaining}s)`);
    };

    tick();
    lockTimer = setInterval(tick, 1000);
  }

  /* ---------------------------- Envío del formulario ---------------------------- */
  function handleSubmit(e) {
    e.preventDefault();

    if (Date.now() < lockUntil) {
      shakeCard();
      return;
    }

    const emailMsg = runEmail();
    const passMsg = runPassword();

    if (emailMsg || passMsg) {
      showFormError('Revisa los campos marcados en rojo.');
      shakeCard();
      (emailMsg ? $('#login-email') : $('#login-password')).trigger('focus');
      return;
    }

    const email = $('#login-email').val().trim();
    const password = $('#login-password').val();
    const remember = $('#login-remember').is(':checked');
    const result = PC.auth.login(email, password, currentRole, remember);

    if (!result.ok) {
      failedAttempts += 1;
      const left = MAX_ATTEMPTS - failedAttempts;
      shakeCard();
      if (left <= 0) {
        lockUntil = Date.now() + LOCK_SECONDS * 1000;
        showFormError(`Demasiados intentos fallidos. Espera ${LOCK_SECONDS} segundos.`);
        startLockCountdown();
      } else {
        showFormError(
          `Correo o contraseña incorrectos para el rol ${PC.auth.roleLabel(currentRole)}. Te quedan ${left} intento(s).`
        );
      }
      $('#login-password').val('').trigger('focus');
      clearFieldState($('#field-password'));
      return;
    }

    // Éxito
    failedAttempts = 0;
    hideFormError();
    $('#login-submit').prop('disabled', true);
    $('#login-submit-label').text('INGRESANDO...');

    if (PC.state && (!PC.state.userName || PC.state.userName === 'Explorador Espacial')) {
      PC.state.setUserName(result.session.name);
    }

    PC.toast.show(`¡Bienvenido, ${result.session.name}! (${PC.auth.roleLabel(result.session.role)})`);

    $('#login-form').fadeTo(300, 0.6, () => {
      let returnTo = '';
      try {
        returnTo = sessionStorage.getItem('planet_chicken_return_to') || '';
        sessionStorage.removeItem('planet_chicken_return_to');
      } catch (e) {}
      PC.router.navigate(returnTo || '#/bienvenida', { replace: true });
    });
  }

  /* ---------------------------- Render ---------------------------- */
  function buildStars() {
    const coords = [
      [8, 12], [16, 84], [30, 6], [40, 92], [58, 8],
      [66, 88], [78, 16], [86, 80], [22, 50], [92, 46],
    ];
    return coords
      .map(
        ([top, left], i) => `
      <span class="space-star" style="top:${top}%; left:${left}%; width:${10 + (i % 2) * 5}px; height:${10 + (i % 2) * 5}px; color:${i % 3 === 0 ? '#ED101F' : '#FFFFFF'}; animation-delay:${(i * 0.3).toFixed(1)}s;">
        ${PC.icons.sparkleStar()}
      </span>`
      )
      .join('');
  }

  function render(root) {
    currentRole = 'usuario';
    const cfg = ROLE_THEMES[currentRole];

    root.innerHTML = `
      <section class="page-view login-screen ${cfg.themeClass}" id="login-screen" aria-label="Iniciar sesión en Planet Chicken">
        <span id="estadoRed" class="network-indicator network-indicator--login is-online" role="status" aria-live="polite" aria-label="En línea" title="En línea">
          <span class="network-indicator-dot" aria-hidden="true"></span>
          <span class="network-indicator-label">En línea</span>
        </span>
        <div class="space-stars">${buildStars()}</div>

        <div class="login-wrap">
          <div class="login-brand">
            <div class="login-logo-glow">
              ${PC.icons.orbitRing()}
              ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Logo Planet Chicken', preset: 'brand', className: 'login-logo-img' })}
            </div>
            <h1 class="login-title">Iniciar sesión</h1>
            <p class="login-subtitle">Elige tu tipo de acceso para continuar</p>
          </div>

          <form class="login-card" id="login-form" novalidate autocomplete="on">
            <div class="login-role-switch" role="radiogroup" aria-label="Tipo de usuario">
              <button type="button" class="login-role-btn is-active" data-role="usuario" role="radio" aria-checked="true">
                ${PC.icons.navProfile()}
                <span>Usuario</span>
              </button>
              <button type="button" class="login-role-btn" data-role="admin" role="radio" aria-checked="false">
                ${ICON_ADMIN()}
                <span>Administrador</span>
              </button>
            </div>

            <div class="login-role-banner">
              <span class="login-role-icon" id="login-role-icon">${cfg.icon()}</span>
              <div class="login-role-copy">
                <strong id="login-role-title">${cfg.title}</strong>
                <span id="login-role-desc">${cfg.desc}</span>
              </div>
            </div>

            <div class="login-field" id="field-email">
              <label for="login-email">Correo electrónico</label>
              <div class="login-input-wrap">
                <span class="login-input-icon">${ICON_MAIL()}</span>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  class="login-input"
                  placeholder="nombre@dominio.com"
                  autocomplete="username"
                  maxlength="60"
                  aria-describedby="login-email-error"
                />
              </div>
              <p class="login-error" id="login-email-error" role="alert"></p>
            </div>

            <div class="login-field" id="field-password">
              <label for="login-password">Contraseña</label>
              <div class="login-input-wrap">
                <span class="login-input-icon">${ICON_LOCK()}</span>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  class="login-input"
                  placeholder="Mínimo 8 caracteres"
                  autocomplete="current-password"
                  maxlength="30"
                  aria-describedby="login-password-error"
                />
                <button type="button" class="login-eye-btn" id="login-toggle-pass" aria-label="Mostrar contraseña">
                  ${ICON_EYE(true)}
                </button>
              </div>
              <p class="login-error" id="login-password-error" role="alert"></p>
            </div>

            <label class="login-remember">
              <input type="checkbox" id="login-remember" />
              <span>Recordar mi sesión</span>
            </label>

            <p class="login-form-error" id="login-form-error" role="alert"></p>

            <button type="submit" class="welcome-cta login-submit" id="login-submit">
              <span id="login-submit-label">${cfg.cta}</span>
            </button>

            <button type="button" class="login-guest-link" data-nav="#/inicio">Seguir explorando como invitado</button>

            <p class="login-demo" id="login-demo-hint">${cfg.demo}</p>
          </form>
        </div>
      </section>
    `;

    if (PC.pwa) PC.pwa.updateNetworkStatus();
    bindEvents();

    if (Date.now() < lockUntil) {
      showFormError(`Demasiados intentos fallidos. Espera unos segundos.`);
      startLockCountdown();
    }
  }

  function bindEvents() {
    // Animación de entrada de la tarjeta
    $('#login-form').hide().fadeIn(450);

    // Selector de rol (Reto PRO)
    $('.login-role-btn').off('click.planetLogin').on('click.planetLogin', function () {
      const role = $(this).data('role');
      if (role !== currentRole) applyRole(role);
    });

    // Validación en vivo
    $('#login-email')
      .off('.planetLogin')
      .on('blur.planetLogin', function () {
        if ($(this).val().length) runEmail();
      })
      .on('input.planetLogin', function () {
        if ($('#field-email').is('.is-invalid, .is-valid')) runEmail();
        hideFormError();
      });

    $('#login-password')
      .off('.planetLogin')
      .on('blur.planetLogin', function () {
        if ($(this).val().length) runPassword();
      })
      .on('input.planetLogin', function () {
        if ($('#field-password').is('.is-invalid, .is-valid')) runPassword();
        hideFormError();
      });

    // Mostrar / ocultar contraseña
    $('#login-toggle-pass').off('click.planetLogin').on('click.planetLogin', function () {
      const $input = $('#login-password');
      const show = $input.attr('type') === 'password';
      $input.attr('type', show ? 'text' : 'password');
      $(this)
        .html(ICON_EYE(!show))
        .attr('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });

    $('#login-form').off('submit.planetLogin').on('submit.planetLogin', handleSubmit);
  }

  function cleanup() {
    if (lockTimer) {
      clearInterval(lockTimer);
      lockTimer = null;
    }
  }

  function resume() {
    if (Date.now() < lockUntil) {
      showFormError('Demasiados intentos fallidos. Espera unos segundos.');
      startLockCountdown();
    }
  }

  PC.pages = PC.pages || {};
  PC.pages.login = { render, cleanup, resume };
})(window);
