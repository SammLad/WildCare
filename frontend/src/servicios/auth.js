const USERS_KEY = 'anima_users';
const SESSION_KEY = 'anima_session';
const REPORTS_KEY = 'anima_reports';

export const VALID_ROLES = ['admin', 'usuario', 'rescatista', 'refugio'];

export const DEMO_ADMIN = {
  email: 'admin@wildcare.com',
  password: 'Admin2026!',
};

export const DEMO_ACCOUNTS = [
  DEMO_ADMIN,
  { email: 'usuario@wildcare.com', password: 'Usuario2026!', nombre: 'Ana García', rol: 'usuario' },
  { email: 'rescatista@wildcare.com', password: 'Rescate2026!', nombre: 'Equipo Rescate', rol: 'rescatista' },
  { email: 'refugio@wildcare.com', password: 'Refugio2026!', nombre: 'Refugio Esperanza', rol: 'refugio' },
];

export const ROLE_LABELS = {
  admin: 'Administrador',
  usuario: 'Usuario',
  rescatista: 'Rescatista',
  refugio: 'Refugio',
};

export function normalizeRole(role) {
  if (!role) return role;
  const normalized = String(role).trim().toLowerCase();
  if (normalized === 'ciudadano') return 'usuario';
  return normalized;
}

export function rolePath(role) {
  const normalized = normalizeRole(role);
  if (!normalized) return '/';
  if (normalized === 'admin') return '/panel/admin';
  return VALID_ROLES.includes(normalized) ? `/panel/${normalized}` : '/';
}

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(value)) throw new Error(`El contenido de ${key} no es una lista.`);
    return value;
  } catch (error) {
    console.error(`No se pudieron leer los datos de ${key}.`, error);
    throw new Error('No fue posible leer los datos guardados. Recarga la página e inténtalo nuevamente.');
  }
}

function ensureDemoData() {
  const users = readArray(USERS_KEY).map((user) => ({
    ...user,
    rol: normalizeRole(user.rol),
  }));

  let usersChanged = false;
  DEMO_ACCOUNTS.forEach((account, index) => {
    if (!users.some((user) => user.email === account.email)) {
      users.push({
        id: `demo-${index}`,
        nombre: account.nombre || 'Administrador Wild Care',
        email: account.email,
        password: account.password,
        rol: account.rol || 'admin',
        estado: 'activo',
      });
      usersChanged = true;
    }
  });

  const normalizedUsers = users.map((user) => ({
    ...user,
    rol: VALID_ROLES.includes(normalizeRole(user.rol)) ? normalizeRole(user.rol) : 'usuario',
  }));

  if (usersChanged || JSON.stringify(users) !== JSON.stringify(normalizedUsers)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(normalizedUsers));
  }

  const reports = readArray(REPORTS_KEY);
  if (reports.length === 0) {
    localStorage.setItem(REPORTS_KEY, JSON.stringify([
      {
        id: 'REP-1042',
        especie: 'Ave silvestre',
        ubicacion: 'Parque del Norte',
        descripcion: 'Ave encontrada en el suelo, con heridas leves y dificultad para volar.',
        estado: 'Pendiente',
        fecha: '2026-10-25',
        reportadoPor: 'Usuario demo',
      },
      {
        id: 'REP-1041',
        especie: 'Mamífero silvestre',
        ubicacion: 'Calle 142 con Carrera 19',
        descripcion: 'Se observó un mamífero en una zona urbana con síntomas de desorientación.',
        estado: 'En atención',
        fecha: '2026-10-24',
        reportadoPor: 'Usuario demo',
      },
    ]));
  }
}

ensureDemoData();

export function getUsers() {
  return readArray(USERS_KEY).map((user) => ({
    ...user,
    rol: normalizeRole(user.rol),
  }));
}

export function getReports() {
  return readArray(REPORTS_KEY);
}

export function saveReports(reports) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function registerCitizen({ nombre, email, password }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('Ya existe una cuenta registrada con ese correo.');
  }

  const user = {
    id: `usr-${Date.now()}`,
    nombre: nombre.trim(),
    email: normalizedEmail,
    password,
    rol: 'usuario',
    estado: 'activo',
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return user;
}

export function signIn(identifier, password) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const user = getUsers().find(
    (candidate) =>
      (candidate.email.toLowerCase() === normalizedIdentifier ||
        candidate.nombre.toLowerCase() === normalizedIdentifier) &&
      candidate.password === password &&
      candidate.estado !== 'suspendido',
  );

  if (!user) throw new Error('Usuario o contraseña incorrectos, o la cuenta está suspendida.');

  const session = { id: user.id, nombre: user.nombre, email: user.email, rol: normalizeRole(user.rol) };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!session) return null;
    return { ...session, rol: normalizeRole(session.rol) };
  } catch (error) {
    console.error('No se pudo recuperar la sesión actual.', error);
    return null;
  }
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}