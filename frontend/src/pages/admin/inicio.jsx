import React from "react";
import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getReports, getSession, getUsers, ROLE_LABELS, normalizeRole, rolePath, saveReports, signOut } from '../../servicios/auth';
import '../../assets/styles/dashboard.css';
import deerIcon from '../../assets/icowhite.png';

const PORTALS = {
  admin: {
    title: 'Centro de administración',
    subtitle: 'Gestiona usuarios, reportes y la coordinación del rescate de fauna silvestre.',
    navigation: ['Resumen', 'Reportes', 'Usuarios'],
    intro: 'Panel general',
    actions: ['Supervisar casos activos', 'Revisar cuentas de la comunidad', 'Reforzar la seguridad de la información'],
  },
  usuario: {
    title: 'Mi espacio de usuario',
    subtitle: 'Reporta animales en peligro y consulta el estado de cada caso compartido.',
    navigation: ['Resumen', 'Mis reportes', 'Guía de auxilio'],
    intro: 'Participación ciudadana',
    actions: ['Registrar emergencias', 'Seguimiento de reportes', 'Consultar recomendaciones de cuidado'],
  },
  rescatista: {
    title: 'Centro de rescate',
    subtitle: 'Consulta reportes pendientes, coordina atención y actualiza el avance del rescate.',
    navigation: ['Resumen', 'Alertas', 'Guía de campo'],
    intro: 'Coordinación de rescates',
    actions: ['Revisa animales reportados', 'Coordina atención en campo', 'Registra traslado y entrega'],
  },
  refugio: {
    title: 'Panel del refugio',
    subtitle: 'Confirma ingresos, actualiza la recuperación y supervisa el historial médico del animal.',
    navigation: ['Resumen', 'Animales recibidos', 'Historial médico'],
    intro: 'Gestión del refugio',
    actions: ['Revisa animales remitidos', 'Actualiza estado de recuperación', 'Registra evolución médica'],
  },
};

function formatDate(date) {
  return date || 'Fecha no registrada';
}

function createReport(form, reporter) {
  return {
    id: `REP-${Date.now().toString().slice(-6)}`,
    especie: form.get('especie').toString().trim(),
    ubicacion: form.get('ubicacion').toString().trim(),
    descripcion: form.get('descripcion').toString().trim(),
    coordenadas: form.get('coordenadas')?.toString().trim() || 'Sin coordenadas registradas',
    emergencia: form.get('emergencia')?.toString() || 'Media',
    fotos: form.getAll('fotos').map((file) => file.name).filter(Boolean),
    estado: 'Pendiente',
    fecha: new Date().toLocaleDateString('es-CO'),
    reportadoPor: reporter,
  };
}

export default function AdminDashboard() {
  const { role: routeRole } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const role = normalizeRole(routeRole);
  const config = PORTALS[role];
  const [activeTab, setActiveTab] = useState(config?.navigation[0] || 'Resumen');
  const [reports, setReports] = useState(getReports);
  const [users] = useState(getUsers);
  const [reportMessage, setReportMessage] = useState('');

  const pendingCount = useMemo(
    () => reports.filter((report) => ['Pendiente', 'Reportado'].includes(report.estado)).length,
    [reports],
  );

  if (!config) return <Navigate to="/" replace />;
  if (!session) return <Navigate to="/login" replace />;
  if (normalizeRole(session.rol) !== role) return <Navigate to={rolePath(session.rol)} replace />;

  function updateReport(reportId, status) {
    const updated = reports.map((report) => (report.id === reportId ? { ...report, estado: status } : report));
    saveReports(updated);
    setReports(updated);
    setReportMessage(`El caso ${reportId} se actualizó: ${status}.`);
  }

  function submitCitizenReport(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const report = createReport(form, session.nombre);
    const updated = [report, ...reports];
    saveReports(updated);
    setReports(updated);
    setReportMessage(`Tu reporte ${report.id} fue guardado.`);
    event.currentTarget.reset();
  }

  function handleSignOut() {
    signOut();
    navigate('/', { replace: true });
  }

  const roleReports = role === 'usuario' ? reports.filter((report) => report.reportadoPor === session.nombre) : reports;

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="brand brand--footer" to="/">
          <img className="brand__mark" src={deerIcon} alt="" />
          <span>Wild Care</span>
        </Link>
        <div className="sidebar-label">Espacio de trabajo</div>
        <nav className="dashboard-nav" aria-label="Secciones del panel">
          {config.navigation.map((item, index) => (
            <button
              className={activeTab === item ? 'dashboard-nav__item is-active' : 'dashboard-nav__item'}
              key={item}
              onClick={() => setActiveTab(item)}
              type="button"
            >
              <span className="nav-icon">{['⌂', '◉', '✦'][index % 3]}</span>
              {item}
            </button>
          ))}
        </nav>

        <button className="button button--quiet dashboard-signout" type="button" onClick={handleSignOut}>
          Cerrar sesión
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="eyebrow">{config.intro}</p>
            <h1>{config.title}</h1>
          </div>
          <div className="user-badge">
            <span>{session.nombre}</span>
            <small>{ROLE_LABELS[session.rol] || session.rol}</small>
          </div>
        </header>

        <section className="dashboard-summary">
          <div className="summary-card">
            <span>Total de reportes</span>
            <strong>{reports.length}</strong>
          </div>
          <div className="summary-card">
            <span>Pendientes</span>
            <strong>{pendingCount}</strong>
          </div>
          <div className="summary-card">
            <span>Usuarios activos</span>
            <strong>{users.filter((user) => user.estado !== 'suspendido').length}</strong>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{config.title}</p>
              <h2>{config.subtitle}</h2>
            </div>
          </div>

          <div className="action-row">
            {config.actions.map((action) => (
              <span className="action-pill" key={action}>{action}</span>
            ))}
          </div>

          {reportMessage && (
            <p className="form-message form-message--success" role="status">
              {reportMessage}
            </p>
          )}

          {activeTab === 'Resumen' && (
            <div className="dashboard-grid">
              <article className="panel-card">
                <h3>Casos recientes</h3>
                <ul className="stack-list">
                  {roleReports.slice(0, 4).map((report) => (
                    <li key={report.id}>
                      <strong>{report.id}</strong>
                      <span>{report.especie}</span>
                      <small>{report.estado} · {formatDate(report.fecha)}</small>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="panel-card">
                <h3>Estado del sistema</h3>
                <p>La red WildCare está funcionando con reportes activos, coordinación de rescatistas y atención del refugio.</p>
              </article>
            </div>
          )}

          {activeTab === 'Reportes' && (
            <div className="reports-panel">
              {reports.map((report) => (
                <article className="report-row" key={report.id}>
                  <div>
                    <strong>{report.id}</strong>
                    <p>{report.especie} · {report.ubicacion}</p>
                  </div>
                  <span>{report.estado}</span>
                  <button type="button" className="button button--quiet" onClick={() => updateReport(report.id, 'En atención')}>
                    En atención
                  </button>
                  <button type="button" className="button button--quiet" onClick={() => updateReport(report.id, 'Resuelto')}>
                    Resuelto
                  </button>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'Mis reportes' && (
            <form className="panel-card report-form" onSubmit={submitCitizenReport}>
              <label htmlFor="especie">Especie</label>
              <input id="especie" name="especie" required />

              <label htmlFor="ubicacion">Ubicación</label>
              <input id="ubicacion" name="ubicacion" required />

              <label htmlFor="coordenadas">Coordenadas</label>
              <input id="coordenadas" name="coordenadas" />

              <label htmlFor="emergencia">Nivel de emergencia</label>
              <select id="emergencia" name="emergencia" defaultValue="Media">
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>

              <label htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" name="descripcion" rows="3" required />

              <button className="button button--primary" type="submit">Guardar reporte</button>
            </form>
          )}

          {activeTab === 'Usuarios' && (
            <div className="users-panel">
              {users.map((user) => (
                <article className="user-row" key={user.id || user.email}>
                  <div>
                    <strong>{user.nombre}</strong>
                    <small>{user.email}</small>
                  </div>
                  <span>{ROLE_LABELS[user.rol] || user.rol}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}