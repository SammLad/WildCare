import React from "react";
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import deerImage from '../../assets/deer.png';
import deerIcon from '../../assets/icowhite.png';
import { getReports, getSession, saveReports, signOut } from '../../servicios/auth';
import '../../assets/styles/home.css';

const stories = [
  {
    title: 'Primeros auxilios',
    text: 'Conoce cómo actuar con calma, evaluar riesgos y evitar la manipulación innecesaria antes de llegar a un rescatista.',
    emoji: '🩺',
  },
  {
    title: 'Registro del caso',
    text: 'Documenta la especie, la ubicación, el nivel de emergencia y cualquier detalle que ayude a la coordinación del rescate.',
    emoji: '📝',
  },
  {
    title: 'Seguimiento del animal',
    text: 'Entiende cómo pasa de un reporte a un rescate, traslado y ingreso formal a un refugio.',
    emoji: '📍',
  },
];

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(getSession);
  const [reports, setReports] = useState(getReports);
  const [reportMessage, setReportMessage] = useState('');
  const [donationAmount, setDonationAmount] = useState('25');
  const [donationMessage, setDonationMessage] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  function handleSignOut() {
    signOut();
    setSession(null);
    navigate('/', { replace: true });
  }

  function submitReport(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const report = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      especie: String(formData.get('especie') || '').trim(),
      ubicacion: String(formData.get('ubicacion') || '').trim(),
      coordenadas: String(formData.get('coordenadas') || '').trim() || 'Sin geolocalización registrada',
      descripcion: String(formData.get('descripcion') || '').trim(),
      emergencia: String(formData.get('emergencia') || 'Media'),
      estado: 'Pendiente',
      fecha: new Date().toLocaleDateString('es-CO'),
      reportadoPor: session?.nombre || 'Usuario anónimo',
    };

    if (!report.especie || !report.ubicacion || !report.descripcion) {
      setReportMessage('Completa la especie, la ubicación y la descripción del caso.');
      return;
    }

    const updatedReports = [report, ...reports];
    saveReports(updatedReports);
    setReports(updatedReports);
    setReportMessage(`Reporte ${report.id} registrado. Un rescatista puede revisar el caso y coordinar la atención.`);
    event.currentTarget.reset();
  }

  function submitDonation(event) {
    event.preventDefault();
    const amount = Number(donationAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setDonationMessage('Escribe un monto válido mayor que cero.');
      return;
    }

    const donations = JSON.parse(localStorage.getItem('anima_donations') || '[]');
    const nextDonations = [
      { id: `DON-${Date.now()}`, monto: amount, fecha: new Date().toISOString() },
      ...donations,
    ];

    localStorage.setItem('anima_donations', JSON.stringify(nextDonations));
    setDonationMessage(`¡Gracias! Registramos tu aporte de $${amount.toLocaleString('es-CO')} para apoyar refugios y rescates.`);
    setDonationAmount('25');
  }

  function submitContact(event) {
    event.preventDefault();
    setContactMessage('Gracias por escribirnos. Tu mensaje quedó registrado en esta demostración.');
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

          <nav className="main-nav" aria-label="Navegación principal">
            <a href="#inicio">Inicio</a>
            <a href="#reportar">Reportar</a>
            <a href="#tacticas">Guía</a>
            <a href="#donaciones">Donaciones</a>
            <a href="#blog">Blog</a>
            <a href="#contacto">Contacto</a>
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
                <Link className="button button--quiet" to="/login">
                  Ingresar
                </Link>
                <Link className="button button--primary" to="/crear-cuenta">
                  Crear cuenta
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
            <span className="eyebrow">WildCare • Rescate de fauna</span>
            <h1>Reporte, rescate y acompaña a la fauna silvestre en riesgo.</h1>
            <p>
              Conectamos personas, rescatistas y refugios para atender emergencias de fauna silvestre,
              coordinar su traslado seguro y apoyar su recuperación.
            </p>
            <div className="hero-actions">
              <a href="#reportar" className="button button--primary">
                Reportar emergencia
              </a>
              <a href="#tacticas" className="button button--outline">
                Ver guía de auxilio
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{reports.length}</strong>
                <span>casos en seguimiento</span>
              </div>
              <div>
                <strong>4</strong>
                <span>roles clave</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>respuesta comunitaria</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img src={deerImage} alt="Fauna silvestre cuidada por la comunidad" />
          </div>
        </section>

        <section className="intro-grid" aria-label="Nuestra misión">
          <article className="intro-card intro-card--highlight">
            <span className="eyebrow">Nuestra misión</span>
            <h2>Responder con rapidez y respeto.</h2>
            <p>
              Facilitamos la atención de animales silvestres en riesgo mediante reportes claros, coordinación
              con rescatistas y seguimiento por parte de refugios especializados.
            </p>
          </article>

          <article className="intro-card">
            <span className="feature-icon">🛟</span>
            <h3>Respuesta coordinada</h3>
            <p>
              Las alertas de la comunidad llegan a rescatistas y refugios preparados para actuar con seguridad.
            </p>
          </article>

          <article className="intro-card">
            <span className="feature-icon">🏥</span>
            <h3>Seguimiento sanitario</h3>
            <p>
              Los animales recuperados son ingresados y monitoreados con información médica y de evolución.
            </p>
          </article>
        </section>

        <section className="content-section" id="reportar">
          <div className="section-heading">
            <span className="eyebrow">Ayuda inmediata</span>
            <h2>¿Viste un animal silvestre en peligro?</h2>
            <p>
              Comparte los datos del caso para que un rescatista pueda evaluar la urgencia y coordinar la atención.
            </p>
          </div>

          <div className="report-layout">
            <form className="panel-card report-form" onSubmit={submitReport}>
              <label htmlFor="report-especie">Especie o tipo de animal</label>
              <input id="report-especie" name="especie" placeholder="Ej. Loro, venado, felino, ave" required />

              <label htmlFor="report-location">Ubicación exacta o referencia</label>
              <input id="report-location" name="ubicacion" placeholder="Dirección, barrio o punto de referencia" required />

              <label htmlFor="report-coordinates">Coordenadas o enlace de ubicación</label>
              <input id="report-coordinates" name="coordenadas" placeholder="Ej. 4.7110,-74.0721 o enlace de mapa" />

              <label htmlFor="report-emergency">Nivel de emergencia</label>
              <select id="report-emergency" name="emergencia" defaultValue="Media">
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>

              <label htmlFor="report-description">¿Qué sucede?</label>
              <textarea
                id="report-description"
                name="descripcion"
                rows="4"
                placeholder="Describe el estado del animal, lesiones, comportamiento o riesgos observados"
                required
              />

              <button className="button button--danger" type="submit">
                Enviar reporte
              </button>
              {reportMessage && (
                <p className="form-message form-message--success" role="status">
                  {reportMessage}
                </p>
              )}
            </form>

            <aside className="rescue-aside">
              <span className="feature-icon">🚨</span>
              <h3>Antes de intervenir</h3>
              <ul>
                <li>No manipules al animal si presenta signos de agresividad o estrés intenso.</li>
                <li>Evita alimentar o medicar sin orientación profesional.</li>
                <li>Comparte una ubicación clara para facilitar la respuesta.</li>
              </ul>
              <Link to="/crear-cuenta">Crear cuenta para dar seguimiento →</Link>
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
