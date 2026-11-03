import React from "react";
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import deerImage from '../../assets/deer.png';
import deerIcon from '../../assets/icowhite.png';
import { getReports, getSession, saveReports, signOut } from '../../servicios/auth';
import '../../assets/styles/home.css';

const actionCards = [
  {
    title: 'Guía de aprendizaje',
    text: 'Descubre cómo actuar con calma antes, durante y después de un caso urgente.',
    href: '/guia',
    icon: '📘',
  },
  {
    title: 'Donación',
    text: 'Aporta en COP para transporte, atención veterinaria y refugios para fauna en riesgo.',
    href: '/donacion',
    icon: '🤝',
  },
  {
    title: 'Contáctanos',
    text: 'Escríbenos para coordinar apoyo, voluntariado y respuesta comunitaria.',
    href: '/contacto',
    icon: '✉️',
  },
];

const reportSteps = [
  'Animal',
  'Ubicación',
  'Evidencias',
  'Contacto',
  'Confirmación',
];

function getContextualGuidance(form) {
  const summaryText = `${form.estado} ${form.descripcionFisica} ${form.descripcionSituacion}`.toLowerCase();
  const isUrgent = /(sangr|herida|grave|desangr|inconsciente|muer|peligro inmediato|muy débil|dolor extremo|agresivo|pérdida de movimiento)/i.test(summaryText);
  const isRoutine = /(calle|avistamiento|sin heridas|sin sangre|desorientado|tranquilo|camina|normal)/i.test(summaryText) || (!form.estado && !form.descripcionFisica && !form.descripcionSituacion);

  if (isUrgent) {
    return {
      title: 'Atención prioritaria',
      summary: 'El animal presenta signos de gravedad y requiere respuesta inmediata de rescate o atención veterinaria.',
      badge: 'Prioridad alta',
      kind: 'urgent',
      steps: [
        'Mantén distancia y evita moverlo si puede empeorar la lesión.',
        'Informa claramente si hay sangre, heridas profundas o riesgo inmediato.',
        'Coordina con un rescatista o servicio veterinario lo antes posible.',
      ],
    };
  }

  if (isRoutine) {
    return {
      title: 'Avistamiento general',
      summary: 'Si el animal está en la vía pública y sin heridas visibles, es importante mantener distancia y reportar la ubicación exacta.',
      badge: 'Seguimiento',
      kind: 'normal',
      steps: [
        'Observa si se encuentra tranquilo o en movimiento constante.',
        'No lo alimentes ni lo acerques si no hay indicación de un rescatista.',
        'Usa la ubicación exacta para que el equipo evalúe la mejor respuesta.',
      ],
    };
  }

  return {
    title: 'Revisión de seguimiento',
    summary: 'El caso requiere una valoración cuidadosa para decidir si requiere apoyo inmediato o seguimiento por parte del equipo.',
    badge: 'Valorar',
    kind: 'watch',
    steps: [
      'Describe el comportamiento del animal con detalle.',
      'Incluye si hay lesiones, movimiento anormal o presencia de riesgo.',
      'La ubicación exacta ayuda a priorizar la intervención.',
    ],
  };
}

const initialReport = {
  animalType: '',
  especie: '',
  cantidad: '1',
  estado: '',
  descripcionFisica: '',
  municipio: '',
  direccion: '',
  barrio: '',
  referencias: '',
  coordenadas: '',
  fechaHora: '',
  fotos: [],
  nombre: '',
  telefono: '',
  email: '',
  contactoPreferencia: 'Teléfono',
  autorizacion: false,
  descripcionSituacion: '',
  apoyo: '',
};

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [session, setSession] = useState(getSession);
  const [reports, setReports] = useState(getReports);
  const [reportMessage, setReportMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [reportForm, setReportForm] = useState(initialReport);
  const [errors, setErrors] = useState({});
  const progressPercent = ((activeStep + 1) / reportSteps.length) * 100;
  const guidance = getContextualGuidance(reportForm);

  function handleSignOut() {
    signOut();
    setSession(null);
    navigate('/', { replace: true });
  }

  function handleNavClose() {
    setNavOpen(false);
  }

  function updateField(field, value) {
    setReportForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  function validateStep(stepIndex) {
    const nextErrors = {};

    if (stepIndex === 0) {
      if (!reportForm.animalType) nextErrors.animalType = 'Selecciona el tipo de animal.';
      if (!reportForm.estado) nextErrors.estado = 'Selecciona el estado del animal.';
      if (!reportForm.cantidad || Number(reportForm.cantidad) <= 0) {
        nextErrors.cantidad = 'La cantidad debe ser mayor que cero.';
      }
      if (!reportForm.descripcionFisica.trim()) {
        nextErrors.descripcionFisica = 'Describe cómo es el animal.';
      }
    }

    if (stepIndex === 1) {
      if (!reportForm.municipio) nextErrors.municipio = 'Selecciona el municipio.';
      if (!reportForm.direccion.trim()) nextErrors.direccion = 'Ingresa la dirección o punto de referencia.';
      if (!reportForm.barrio.trim()) nextErrors.barrio = 'Indica el barrio o sector.';
      if (!reportForm.fechaHora) nextErrors.fechaHora = 'Selecciona la fecha y hora del avistamiento.';
    }

    if (stepIndex === 2) {
      if (reportForm.fotos.length > 0) {
        const invalidImage = reportForm.fotos.some((image) => image.size && image.size > 5 * 1024 * 1024);
        if (invalidImage) nextErrors.fotos = 'Cada imagen debe pesar máximo 5 MB.';
      }
    }

    if (stepIndex === 3) {
      if (!reportForm.nombre.trim()) nextErrors.nombre = 'Escribe el nombre completo.';
      if (!reportForm.telefono.trim()) nextErrors.telefono = 'Ingresa un número de contacto.';
      if (!/^\d{7,10}$/.test(reportForm.telefono.replace(/\s|\+|-/g, ''))) {
        nextErrors.telefono = 'Usa un número válido de 7 a 10 dígitos.';
      }
      if (!reportForm.email.trim()) nextErrors.email = 'Escribe tu correo.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reportForm.email)) {
        nextErrors.email = 'Ingresa un correo válido.';
      }
      if (!reportForm.autorizacion) nextErrors.autorizacion = 'Debes autorizar el tratamiento de datos.';
    }

    if (stepIndex === 4) {
      if (!reportForm.descripcionSituacion.trim()) {
        nextErrors.descripcionSituacion = 'Explica qué ocurrió en el avistamiento.';
      }
    }

    setErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  }

  function handleNextStep() {
    const isValid = validateStep(activeStep);
    if (!isValid) return;
    setActiveStep((current) => Math.min(current + 1, reportSteps.length - 1));
  }

  function handlePreviousStep() {
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function handleImageSelection(event) {
    const nextFiles = Array.from(event.target.files || []);
    const validFiles = nextFiles.filter((file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024);

    if (nextFiles.length && validFiles.length !== nextFiles.length) {
      setErrors((current) => ({ ...current, fotos: 'Solo se permiten imágenes JPG, PNG o WEBP menores a 5 MB.' }));
      return;
    }

    const imageReaders = validFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ name: file.name, size: file.size, src: reader.result });
          reader.onerror = () => reject(new Error('No se pudo procesar la imagen.'));
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(imageReaders)
      .then((images) => {
        setReportForm((current) => ({ ...current, fotos: [...current.fotos, ...images] }));
        setErrors((current) => ({ ...current, fotos: '' }));
        event.target.value = '';
      })
      .catch(() => {
        setErrors((current) => ({ ...current, fotos: 'No se pudieron cargar algunas imágenes.' }));
      });
  }

  function removeImage(imageName) {
    setReportForm((current) => ({
      ...current,
      fotos: current.fotos.filter((image) => image.name !== imageName),
    }));
  }

  function submitReport(event) {
    event.preventDefault();
    const isValid = validateStep(activeStep) && validateStep(0) && validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4);
    if (!isValid) return;

    const report = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      tipoAnimal: reportForm.animalType,
      especie: reportForm.especie.trim() || 'No identificada',
      cantidad: Number(reportForm.cantidad) || 1,
      descripcionFisica: reportForm.descripcionFisica.trim(),
      municipio: reportForm.municipio,
      direccion: reportForm.direccion.trim(),
      barrio: reportForm.barrio.trim(),
      referencias: reportForm.referencias.trim(),
      coordenadas: reportForm.coordenadas.trim(),
      fechaHora: reportForm.fechaHora,
      fotos: reportForm.fotos,
      nombre: reportForm.nombre.trim(),
      telefono: reportForm.telefono.trim(),
      email: reportForm.email.trim(),
      contactoPreferencia: reportForm.contactoPreferencia,
      descripcionSituacion: reportForm.descripcionSituacion.trim(),
      apoyo: reportForm.apoyo.trim(),
      nivelUrgencia: reportForm.estado,
      estado: 'Pendiente',
      fecha: new Date().toLocaleDateString('es-CO'),
      reportadoPor: reportForm.nombre.trim() || session?.nombre || 'Usuario anónimo',
    };

    const updatedReports = [report, ...reports];
    saveReports(updatedReports);
    setReports(updatedReports);
    setReportMessage(`Tu reporte ${report.id} fue recibido en la plataforma. Un equipo de respuesta puede revisarlo y coordinar la atención.`);
    setReportForm(initialReport);
    setErrors({});
    setActiveStep(0);
    event.currentTarget.reset();
  }

  return (
    <div className="home-wrapper">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand" aria-label="Anima Nova, inicio">
            <img className="brand__mark" src={deerImage} alt="" />
            <span>Anima Nova</span>
          </Link>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-expanded={navOpen}
            aria-label="Abrir menú"
            onClick={() => setNavOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`main-nav ${navOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
            <Link to="/" onClick={handleNavClose}>Inicio</Link>
            <Link to="/guia" onClick={handleNavClose}>Guía de aprendizaje</Link>
            <Link to="/donacion" onClick={handleNavClose}>Donación</Link>
            <Link to="/contacto" onClick={handleNavClose}>Contáctanos</Link>
          </nav>

          <div className="header-actions">
            {session ? (
              <>
                <span className="session-greeting">Hola, {session.nombre}</span>
                <button className="button button--quiet" type="button" onClick={handleSignOut}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link className="button button--quiet" to="/login" onClick={handleNavClose}>
                  Iniciar sesión
                </Link>
                <Link className="button button--primary" to="/crear-cuenta" onClick={handleNavClose}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="public-main">
        {location.state?.notice && (
          <p className="public-notice" role="status">
            {location.state.notice}
          </p>
        )}

        <section className="hero-section" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow">WildCare · Protección de fauna</span>
            <h1>Cada vida silvestre merece una segunda oportunidad.</h1>
            <p>
              Conectamos a la comunidad con la protección y el rescate de la fauna silvestre de nuestra región.
            </p>
            <div className="hero-actions">
              <a href="#reportar" className="button button--primary">
                Reportar un animal
              </a>
              <Link to="/guia" className="button button--outline">
                Ver guía
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{reports.length}</strong>
                <span>Casos activos</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Municipios</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Respuesta</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Ilustración de fauna silvestre">
            <div className="hero-visual__badge">
              <span>WildCare</span>
              <strong>Red de protección animal</strong>
            </div>
            <img src={deerImage} alt="Fauna silvestre cuidada por la comunidad" />
          </div>
        </section>

        <section className="content-section cards-section">
          <div className="section-heading">
            <span className="eyebrow">Tu acción protege la vida silvestre</span>
            <h2>Aprende, dona y acompaña la recuperación.</h2>
          </div>

          <div className="feature-grid">
            {actionCards.map((card) => (
              <Link to={card.href} className="feature-card" key={card.title}>
                <span className="feature-card__icon">{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span className="feature-card__link">Explorar</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section quick-report" id="reportar">
          <div className="section-heading">
            <span className="eyebrow">Reporte</span>
            <h2>Haz visible un caso urgente.</h2>
          </div>

          <div className="report-shell">
            <form className="report-form" onSubmit={submitReport} noValidate>
              <div className="report-form__topbar">
                <div className="report-form__header">
                  <span className="report-form__eyebrow">Reporte de caso</span>
                  <strong>Respuesta en menos de 2 horas</strong>
                </div>

                <div className="report-progress" aria-label="Progreso del formulario">
                  <div className="report-progress__rail" aria-hidden="true">
                    <span style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="report-progress__meta">
                    <span>Paso {Math.min(activeStep + 1, reportSteps.length)} de {reportSteps.length}</span>
                    <strong>{reportSteps[activeStep]}</strong>
                  </div>
                </div>
              </div>

              {activeStep === 0 && (
                <div className="report-step">
                  <div className="report-step__title-row">
                    <h3>Información del animal</h3>
                    <span>1/5</span>
                  </div>

                  <div className="field-grid field-grid--two">
                    <div className="field">
                      <label htmlFor="animal-type">Tipo de animal</label>
                      <select id="animal-type" value={reportForm.animalType} onChange={(event) => updateField('animalType', event.target.value)}>
                        <option value="">Selecciona</option>
                        <option value="Mamífero">Mamífero</option>
                        <option value="Ave">Ave</option>
                        <option value="Reptil">Reptil</option>
                        <option value="Anfibio">Anfibio</option>
                        <option value="Otro">Otro</option>
                        <option value="No identificado">No identificado</option>
                      </select>
                      {errors.animalType && <span className="field-error">{errors.animalType}</span>}
                    </div>

                    <div className="field">
                      <label htmlFor="report-especie">Nombre o especie</label>
                      <input
                        id="report-especie"
                        value={reportForm.especie}
                        onChange={(event) => updateField('especie', event.target.value)}
                        placeholder="Ej. venado, loro, felino"
                      />
                    </div>
                  </div>

                  <div className="field-grid field-grid--two">
                    <div className="field">
                      <label htmlFor="report-cantidad">Cantidad de animales</label>
                      <input
                        id="report-cantidad"
                        type="number"
                        min="1"
                        value={reportForm.cantidad}
                        onChange={(event) => updateField('cantidad', event.target.value)}
                      />
                      {errors.cantidad && <span className="field-error">{errors.cantidad}</span>}
                    </div>

                    <div className="field">
                      <label htmlFor="report-state">Estado del animal</label>
                      <select id="report-state" value={reportForm.estado} onChange={(event) => updateField('estado', event.target.value)}>
                        <option value="">Selecciona</option>
                        <option value="Herido">Herido</option>
                        <option value="En peligro">En peligro</option>
                        <option value="Atrapado">Atrapado</option>
                        <option value="Desorientado">Desorientado</option>
                        <option value="Muerto">Muerto</option>
                        <option value="Comportamiento inusual">Comportamiento inusual</option>
                      </select>
                      {errors.estado && <span className="field-error">{errors.estado}</span>}
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="report-physical">Descripción física del animal</label>
                    <textarea
                      id="report-physical"
                      rows="4"
                      value={reportForm.descripcionFisica}
                      onChange={(event) => updateField('descripcionFisica', event.target.value)}
                      placeholder="Tamaño, color, si se observa sangre, heridas, movimiento, etc."
                    />
                    {errors.descripcionFisica && <span className="field-error">{errors.descripcionFisica}</span>}
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="report-step">
                  <div className="report-step__title-row">
                    <h3>Ubicación del avistamiento</h3>
                    <span>2/5</span>
                  </div>

                  <div className="field-grid field-grid--two">
                    <div className="field">
                      <label htmlFor="report-municipio">Municipio</label>
                      <select id="report-municipio" value={reportForm.municipio} onChange={(event) => updateField('municipio', event.target.value)}>
                        <option value="">Selecciona</option>
                        <option value="Mosquera">Mosquera</option>
                        <option value="Funza">Funza</option>
                        <option value="Madrid">Madrid</option>
                        <option value="Facatativá">Facatativá</option>
                      </select>
                      {errors.municipio && <span className="field-error">{errors.municipio}</span>}
                    </div>

                    <div className="field">
                      <label htmlFor="report-date">Fecha y hora</label>
                      <input
                        id="report-date"
                        type="datetime-local"
                        value={reportForm.fechaHora}
                        onChange={(event) => updateField('fechaHora', event.target.value)}
                      />
                      {errors.fechaHora && <span className="field-error">{errors.fechaHora}</span>}
                    </div>
                  </div>

                  <div className="field-grid field-grid--two">
                    <div className="field">
                      <label htmlFor="report-direction">Dirección o lugar específico</label>
                      <input
                        id="report-direction"
                        value={reportForm.direccion}
                        onChange={(event) => updateField('direccion', event.target.value)}
                        placeholder="Calle, avenida o punto de referencia"
                      />
                      {errors.direccion && <span className="field-error">{errors.direccion}</span>}
                    </div>

                    <div className="field">
                      <label htmlFor="report-barrio">Barrio o sector</label>
                      <input
                        id="report-barrio"
                        value={reportForm.barrio}
                        onChange={(event) => updateField('barrio', event.target.value)}
                        placeholder="Ej. La Floresta, urbanización, vereda"
                      />
                      {errors.barrio && <span className="field-error">{errors.barrio}</span>}
                    </div>
                  </div>

                  <div className="field-grid field-grid--two">
                    <div className="field">
                      <label htmlFor="report-references">Referencias para encontrar el lugar</label>
                      <input
                        id="report-references"
                        value={reportForm.referencias}
                        onChange={(event) => updateField('referencias', event.target.value)}
                        placeholder="Ej. frente al parque, a 100 m del colegio"
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="report-coordinates">Coordenadas</label>
                      <input
                        id="report-coordinates"
                        value={reportForm.coordenadas}
                        onChange={(event) => updateField('coordenadas', event.target.value)}
                        placeholder="4.69, -74.21"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="report-step">
                  <div className="report-step__title-row">
                    <h3>Evidencias</h3>
                    <span>3/5</span>
                  </div>

                  <div className="upload-box">
                    <label htmlFor="report-images" className="upload-box__label">
                      <span>Subir fotografías</span>
                      <small>JPG, PNG o WEBP · Máx. 5 MB por imagen</small>
                    </label>
                    <input id="report-images" type="file" accept="image/*" multiple onChange={handleImageSelection} />
                  </div>

                  {errors.fotos && <span className="field-error">{errors.fotos}</span>}

                  {reportForm.fotos.length > 0 && (
                    <div className="image-preview-grid">
                      {reportForm.fotos.map((image) => (
                        <div className="image-preview" key={`${image.name}-${image.src}`}>
                          <img src={image.src} alt={image.name} />
                          <button type="button" onClick={() => removeImage(image.name)}>
                            Quitar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeStep === 3 && (
                <div className="report-step">
                  <div className="report-step__title-row">
                    <h3>Información del reportante</h3>
                    <span>4/5</span>
                  </div>

                  <div className="field-grid field-grid--two">
                    <div className="field">
                      <label htmlFor="report-name">Nombre completo</label>
                      <input
                        id="report-name"
                        value={reportForm.nombre}
                        onChange={(event) => updateField('nombre', event.target.value)}
                        placeholder="Tu nombre completo"
                      />
                      {errors.nombre && <span className="field-error">{errors.nombre}</span>}
                    </div>

                    <div className="field">
                      <label htmlFor="report-phone">Número de contacto</label>
                      <input
                        id="report-phone"
                        value={reportForm.telefono}
                        onChange={(event) => updateField('telefono', event.target.value)}
                        placeholder="300 123 4567"
                      />
                      {errors.telefono && <span className="field-error">{errors.telefono}</span>}
                    </div>
                  </div>

                  <div className="field-grid field-grid--two">
                    <div className="field">
                      <label htmlFor="report-email">Correo electrónico</label>
                      <input
                        id="report-email"
                        type="email"
                        value={reportForm.email}
                        onChange={(event) => updateField('email', event.target.value)}
                        placeholder="correo@ejemplo.com"
                      />
                      {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className="field">
                      <label htmlFor="report-contact">Preferencia de contacto</label>
                      <select id="report-contact" value={reportForm.contactoPreferencia} onChange={(event) => updateField('contactoPreferencia', event.target.value)}>
                        <option value="Teléfono">Teléfono</option>
                        <option value="Correo">Correo</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="No importa">No importa</option>
                      </select>
                    </div>
                  </div>

                  <div className="checkbox-row">
                    <input
                      id="report-authorized"
                      type="checkbox"
                      checked={reportForm.autorizacion}
                      onChange={(event) => updateField('autorizacion', event.target.checked)}
                    />
                    <label htmlFor="report-authorized">Autorizo el tratamiento de mis datos personales para este reporte.</label>
                  </div>
                  {errors.autorizacion && <span className="field-error">{errors.autorizacion}</span>}
                </div>
              )}

              {activeStep === 4 && (
                <div className="report-step">
                  <div className="report-step__title-row">
                    <h3>Descripción de la situación</h3>
                    <span>5/5</span>
                  </div>

                  <div className="field">
                    <label htmlFor="report-situation">¿Qué ocurrió?</label>
                    <textarea
                      id="report-situation"
                      rows="5"
                      value={reportForm.descripcionSituacion}
                      onChange={(event) => updateField('descripcionSituacion', event.target.value)}
                      placeholder="Describe qué estaba haciendo el animal, desde cuándo lo observa, si hay peligro cercano o si requiere atención inmediata."
                    />
                    {errors.descripcionSituacion && <span className="field-error">{errors.descripcionSituacion}</span>}
                  </div>

                  <div className="field">
                    <label htmlFor="report-support">Preguntas de apoyo</label>
                    <textarea
                      id="report-support"
                      rows="3"
                      value={reportForm.apoyo}
                      onChange={(event) => updateField('apoyo', event.target.value)}
                      placeholder="Ej. ¿Qué hacía el animal? ¿Desde cuándo lo observa? ¿Hay una zona de riesgo o algún peligro cercano?"
                    />
                  </div>
                </div>
              )}

              <div className="report-actions">
                {activeStep > 0 && (
                  <button type="button" className="button button--outline" onClick={handlePreviousStep}>
                    Volver
                  </button>
                )}

                {activeStep < reportSteps.length - 1 ? (
                  <button type="button" className="button button--primary" onClick={handleNextStep}>
                    Siguiente
                  </button>
                ) : (
                  <button type="submit" className="button button--primary">
                    Enviar reporte
                  </button>
                )}
              </div>

              {reportMessage && (
                <p className="form-message form-message--success" role="status">
                  {reportMessage}
                </p>
              )}
            </form>

            <aside className={`report-side-panel report-side-panel--${guidance.kind}`}>
              <div className="report-side-panel__header">
                <span className="eyebrow">Qué hacer</span>
                <h3>{guidance.title}</h3>
              </div>

              <p className="report-side-panel__summary">{guidance.summary}</p>

              {guidance.kind === 'urgent' && <div className="report-side-panel__alert">Atención prioritaria</div>}

              <ul>
                {guidance.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>

              <div className="report-side-panel__info">
                <strong>{guidance.badge}</strong>
                <p>La orientación se actualiza según la información que vas reportando.</p>
              </div>

              <Link to="/guia" className="button button--outline">Ver guía útil</Link>
            </aside>
          </div>

          <div className="recent-cases">
            <h3>Casos activos en la comunidad</h3>
            <div className="case-grid">
              {reports.slice(0, 3).map((report) => (
                <article className="case-card" key={report.id}>
                  <div className="case-card__top">
                    <span>{report.especie}</span>
                    <span className="status-pill">{report.estado}</span>
                  </div>
                  <h4>{report.id}</h4>
                  <p>{report.ubicacion}</p>
                  <small>{report.fecha}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section tactics-section" id="tacticas">
          <div className="section-heading">
            <span className="eyebrow">Guía de auxilio</span>
            <h2>Actúa con precaución y criterio</h2>
            <p>
              Estas recomendaciones orientan la atención inicial sin sustituir la evaluación profesional del equipo de rescate.
            </p>
          </div>

          <div className="info-grid">
            <article className="info-card">
              <span className="severity severity--high">Crítico</span>
              <h3>Mamíferos y felinos</h3>
              <p>
                Si el animal presenta heridas graves, mantén distancia y evita inmovilizarlo sin orientación.
                Reporta la ubicación exacta y el nivel de emergencia.
              </p>
            </article>

            <article className="info-card">
              <span className="severity severity--medium">Moderado</span>
              <h3>Aves y voladores</h3>
              <p>
                Reduce el ruido y busca un espacio tranquilo. No intentes obligarlo a comer ni darle agua si está exhausto o herido.
              </p>
            </article>

            <article className="info-card">
              <span className="severity severity--low">Preventivo</span>
              <h3>Fauna silvestre</h3>
              <p>
                Nunca lo captures ni lo lleves a tu hogar. Aleja a personas y mascotas para evitar estrés o ataque.
              </p>
            </article>
          </div>
        </section>

        <section className="content-section" id="donaciones">
          <div className="section-heading">
            <span className="eyebrow">Apóyanos</span>
            <h2>Convierte tus aportes en ayuda real</h2>
            <p>
              Los recursos permiten cubrir transporte, alimentación, alojamiento temporal y atención veterinaria.
            </p>
          </div>

          <form className="panel-card donation-form" onSubmit={submitDonation}>
            <label htmlFor="donation-amount">Monto de apoyo</label>
            <input
              id="donation-amount"
              type="number"
              min="1"
              step="1"
              value={donationAmount}
              onChange={(event) => setDonationAmount(event.target.value)}
              required
            />
            <button className="button button--primary" type="submit">
              Registrar aporte
            </button>
            {donationMessage && (
              <p className="form-message form-message--success" role="status">
                {donationMessage}
              </p>
            )}
          </form>
        </section>

        <section className="content-section" id="blog">
          <div className="section-heading">
            <span className="eyebrow">Contenido educativo</span>
            <h2>Aprendamos a actuar mejor</h2>
            <p>
              Información útil para evitar riesgos, coordinar rescates y acompañar la recuperación de especies en peligro.
            </p>
          </div>

          <div className="info-grid blog-grid">
            {stories.map((story, index) => (
              <article className="info-card blog-card" key={story.title}>
                <span className="blog-number">0{index + 1}</span>
                <span className="feature-icon feature-icon--in-card">{story.emoji}</span>
                <h3>{story.title}</h3>
                <p>{story.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section contact-section" id="contacto">
          <div className="contact-copy">
            <span className="eyebrow">Estamos para ayudarte</span>
            <h2>Conversemos</h2>
            <p>¿Tienes dudas, quieres apoyar la red o compartir información útil para la comunidad?</p>
            <a href="mailto:hola@wildcare.org">hola@wildcare.org</a>
          </div>

          <form className="contact-form" onSubmit={submitContact}>
            <label htmlFor="contact-name">Tu nombre</label>
            <input id="contact-name" name="nombre" required />

            <label htmlFor="contact-email">Correo electrónico</label>
            <input id="contact-email" name="correo" type="email" required />

            <label htmlFor="contact-message">Mensaje</label>
            <textarea id="contact-message" name="mensaje" rows="3" required />

            <button className="button button--primary" type="submit">
              Enviar mensaje
            </button>
            {contactMessage && (
              <p className="form-message form-message--success" role="status">
                {contactMessage}
              </p>
            )}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <Link className="brand brand--footer" to="/">
          <img className="brand__mark" src={deerIcon} alt="" />
          <span>Wild Care</span>
        </Link>
        <p>Protegemos la fauna y acompañamos la recuperación de cada especie.</p>
        <div>
          <Link to="/login">Ingresar</Link>
          <Link to="/crear-cuenta">Crear cuenta</Link>
        </div>
        <small>&copy; 2026 Wild Care · Plataforma demostrativa</small>
      </footer>
    </div>
  );
}
