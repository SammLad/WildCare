/* ===========================================================
   WildCare — storage.js (Frontera de Datos & Reglas de Negocio)
=========================================================== */

const WC_KEYS = {
  USERS: 'wc_users',
  SESSION: 'wc_session',
  REPORTS: 'wc_reports',
  DONATIONS: 'wc_donations',
  BLOG: 'wc_blog',
  ADOPTIONS: 'wc_adoptions',
  JORNADAS: 'wc_jornadas',
  SPECIALISTS: 'wc_specialists',
  NOTIFICATIONS: 'wc_notifications',
  VOLUNTEER_REQUESTS: 'wc_volunteer_requests',
  CONTACT_REQUESTS: 'wc_contact_requests',
  ADOPTION_REQUIREMENTS: 'wc_adoption_requirements',
  ENTITIES: 'wc_entities',
  SEEDED: 'wc_seeded_v3'
};

function wcGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Error leyendo LocalStorage:', key, e);
    return fallback;
  }
}

function wcSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function wcUid(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Inicialización de datos para cumplir con los criterios de aceptación
function wcSeedAll() {
  if (wcGet(WC_KEYS.SEEDED, false)) return;

  // Especialistas
  wcSet(WC_KEYS.SPECIALISTS, [
    { id: 'esp_1', nombre: 'Dra. Elena Rostova', especialidad: 'Fauna Silvestre y Aves', contacto: 'elena.wildlife@gmail.com', telefono: '+57 312 456 7890' },
    { id: 'esp_2', nombre: 'Dr. Carlos Mendoza', especialidad: 'Grandes Felinos y Mamíferos', contacto: 'carlos.m@vetcare.org', telefono: '+57 315 987 6543' }
  ]);

  // Jornadas de Adopción
  wcSet(WC_KEYS.JORNADAS, [
    { id: 'jor_1', titulo: 'Gran Jornada por la Fauna Doméstica', fecha: '2026-07-15', lugar: 'Parque Central de la Ciudad', descripcion: 'Ven y conoce a tu próximo compañero de vida. Estaremos entregando kits de bienvenida.' }
  ]);

  // Reportes Iniciales (Flujo Dinámico)
  wcSet(WC_KEYS.REPORTS, [
    {
      id: 'REP_9921',
      tipoAnimal: 'Gato',
      clasificacion: 'Doméstico',
      descripcion: 'Gatito rescatado en buen estado, ideal para adopción responsable.',
      ubicacion: 'Transversal 54 #10-22',
      coordenadas: 'https://maps.google.com/?q=4.6104,-74.0721',
      estado: 'en-adopcion',
      foto: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=400&auto=format&fit=crop',
      fecha: '2026-06-21T15:45:00.000Z',
      comentarios: ['Listo para recibir un hogar seguro.'],
      historialMedico: [{ fecha: '2026-06-22', diagnostico: 'Desparasitación', tratamiento: 'Control veterinario y vacunas.' }]
    },
    {
      id: 'REP_4812',
      tipoAnimal: 'Canino',
      clasificacion: 'Doméstico',
      descripcion: 'Perrito herido en una pata encontrado cerca de la autopista norte.',
      ubicacion: 'Calle 142 con Carrera 19',
      coordenadas: 'https://maps.google.com/?q=4.7258,-74.0422',
      estado: 'reportado',
      foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop',
      fecha: '2026-06-22T10:30:00.000Z',
      comentarios: [],
      historialMedico: []
    }
  ]);

  // Blog Base (Artículos Informativos y Rescates Exitosos)
  wcSet(WC_KEYS.BLOG, [
    { id: 'art_1', titulo: 'Primeros auxilios ante fracturas de aves', contenido: 'Nunca intentes entablillar el ala sin guantes. Mantén al ave en una caja oscura y ventilada.', aprobado: true, fecha: '2026-06-18', foto: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=400&auto=format&fit=crop' },
    { id: 'art_2', titulo: 'Rescate Exitoso: El retorno del Venado de Oro', contenido: 'Gracias al reporte oportuno de la comunidad, logramos recuperar un ciervo juvenil que deambulaba por la zona escolar.', aprobado: true, fecha: '2026-06-20', foto: 'https://plus.unsplash.com/premium_photo-1661819541230-034d07819c9b?q=80&w=400&auto=format&fit=crop' }
  ]);

  // Donaciones Base
  wcSet(WC_KEYS.DONATIONS, [
    { id: 'TX_99012', monto: 50, fecha: '2026-06-23T08:12:00.000Z', donante: 'Anónimo' }
  ]);

  // Solicitudes de Voluntariado y Contacto Base
  wcSet(WC_KEYS.VOLUNTEER_REQUESTS, []);
  wcSet(WC_KEYS.CONTACT_REQUESTS, []);

  // Requisitos de adopción y entidades de gestión
  wcSet(WC_KEYS.ADOPTION_REQUIREMENTS, [
    'Documento de identidad vigente',
    'Espacio seguro y adecuado para el animal',
    'Compromiso de cuidado responsable y seguimiento veterinario'
  ]);
  wcSet(WC_KEYS.ENTITIES, [
    { id: 'usr_1', tipo: 'usuario', nombre: 'María López', email: 'maria@example.com', estado: 'activo' },
    { id: 'ref_1', tipo: 'refugio', nombre: 'Refugio Central WildCare', email: 'refugio@wildcare.com', estado: 'activo' },
    { id: 'zoo_1', tipo: 'zoologico', nombre: 'Zoológico Regional Norte', email: 'zoo@wildcare.com', estado: 'activo' },
    { id: 'res_1', tipo: 'rescatista', nombre: 'Camilo Rojas', email: 'camilo@example.com', estado: 'activo' }
  ]);

  // Notificaciones Base
  wcSet(WC_KEYS.NOTIFICATIONS, [
    { id: 'not_1', mensaje: 'Nuevo reporte de Canino en peligro en Calle 142.', fecha: new Date().toISOString(), ubicacion: 'Calle 142 con Carrera 19' }
  ]);

  // Sesión por defecto como Administrador/Rescatista/Refugio integrado para control de testing continuo
  wcSet(WC_KEYS.SESSION, { usuario: 'Test Core', rol: 'admin' });
  wcSet(WC_KEYS.SEEDED, true);
}

wcSeedAll();

// Funciones helper globales del ecosistema
function wcGetReports() { return wcGet(WC_KEYS.REPORTS, []); }
function wcSaveReports(reports) { wcSet(WC_KEYS.REPORTS, reports); }
function wcGetDonations() { return wcGet(WC_KEYS.DONATIONS, []); }
function wcGetBlog() { return wcGet(WC_KEYS.BLOG, []); }
function wcGetSpecialists() { return wcGet(WC_KEYS.SPECIALISTS, []); }
function wcGetJornadas() { return wcGet(WC_KEYS.JORNADAS, []); }
function wcGetNotifications() { return wcGet(WC_KEYS.NOTIFICATIONS, []); }
function wcGetAdoptions() { return wcGet(WC_KEYS.ADOPTIONS, []); }
function wcGetVolunteerRequests() { return wcGet(WC_KEYS.VOLUNTEER_REQUESTS, []); }
function wcGetContactRequests() { return wcGet(WC_KEYS.CONTACT_REQUESTS, []); }
function wcGetAdoptionRequirements() { return wcGet(WC_KEYS.ADOPTION_REQUIREMENTS, []); }
function wcSaveAdoptionRequirements(requirements) { wcSet(WC_KEYS.ADOPTION_REQUIREMENTS, requirements); }
function wcGetEntities() { return wcGet(WC_KEYS.ENTITIES, []); }
function wcSaveEntities(entities) { wcSet(WC_KEYS.ENTITIES, entities); }
function wcSaveVolunteerRequests(requests) { wcSet(WC_KEYS.VOLUNTEER_REQUESTS, requests); }
function wcSaveContactRequests(requests) { wcSet(WC_KEYS.CONTACT_REQUESTS, requests); }

const WC_ESTADOS = {
  'reportado': { label: 'Reportado', clase: 'bg-danger text-white' },
  'en-camino': { label: 'En Camino', clase: 'bg-warning text-dark' },
  'rescatado': { label: 'Rescatado', clase: 'bg-info text-white' },
  'en-refugio': { label: 'En Refugio', clase: 'bg-purple text-white' },
  'en-adopcion': { label: 'En Adopción', clase: 'bg-success text-white' },
  'adoptado': { label: 'Adoptado', clase: 'bg-secondary text-white' }
};

function wcEstadoBadge(estado) {
  const e = WC_ESTADOS[estado] || { label: estado, clase: 'bg-dark text-white' };
  return `<span class="badge ${e.clase} px-3 py-1 rounded-pill">${e.label}</span>`;
}