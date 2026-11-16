/* ==========================================================================
   AUTENTICACIÓN (LOGIN USUARIO / ADMINISTRADOR) + SESIÓN
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  const SESSION_KEY = 'planet_chicken_session';

  // Cuentas de demostración (proyecto académico sin backend)
  const ACCOUNTS = {
    usuario: [
      { email: 'cliente@planetchicken.bo', password: 'Cliente123', name: 'Cliente Planet' },
    ],
    admin: [
      { email: 'admin@planetchicken.bo', password: 'Admin123', name: 'Administrador' },
    ],
  };

  const ROLE_LABELS = {
    usuario: 'Cliente',
    admin: 'Administrador',
  };

  function readSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function getSession() {
    return readSession();
  }

  function isLoggedIn() {
    const s = readSession();
    return !!(s && s.email && s.role);
  }

  function isAdmin() {
    const s = readSession();
    return !!(s && s.role === 'admin');
  }

  /**
   * Verifica las credenciales para el rol elegido.
   * @returns {{ ok: boolean, session?: object }}
   */
  function login(email, password, role, remember) {
    const list = ACCOUNTS[role] || [];
    const normalized = String(email).trim().toLowerCase();
    const account = list.find((a) => a.email === normalized && a.password === password);
    if (!account) return { ok: false };

    const session = {
      email: account.email,
      name: account.name,
      role,
      loggedAt: new Date().toISOString(),
    };

    try {
      const raw = JSON.stringify(session);
      sessionStorage.setItem(SESSION_KEY, raw);
      if (remember) {
        localStorage.setItem(SESSION_KEY, raw);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {}

    return { ok: true, session };
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function roleLabel(role) {
    const r = role || (readSession() || {}).role;
    return ROLE_LABELS[r] || 'Invitado';
  }

  PC.auth = {
    ACCOUNTS,
    getSession,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    roleLabel,
  };
})(window);
