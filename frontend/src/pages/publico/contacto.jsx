import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import deerImage from '../../assets/deer.png';
import '../../assets/styles/home.css';

export default function ContactPage() {
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('Gracias por escribirnos. Nuestro equipo revisará tu mensaje y responderá pronto.');
    event.currentTarget.reset();
  }

  return (
    <div className="page-shell page-shell--compact">
      <header className="page-header">
        <Link to="/" className="brand" aria-label="Anima Nova, inicio">
          <img className="brand__mark" src={deerImage} alt="" />
          <span>Anima Nova</span>
        </Link>

        <nav className="page-nav" aria-label="Navegación secundaria">
          <Link to="/">Inicio</Link>
          <Link to="/guia">Guía</Link>
          <Link to="/donacion">Donación</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>
      </header>

      <main className="page-main page-main--centered">
        <section className="page-panel page-panel--split">
          <div className="page-copy">
            <span className="eyebrow">Contáctanos</span>
            <h1>Estamos para apoyar a la comunidad.</h1>
            <p>
              Si quieres colaborar, reportar una emergencia o participar en actividades de conservación, escríbenos.
            </p>
            <ul className="contact-list">
              <li>hola@animanova.org</li>
              <li>+57 300 000 0000</li>
              <li>Reserva natural y red de rescate regional</li>
            </ul>
          </div>

          <form className="page-form contact-form" onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Tu nombre</label>
            <input id="contact-name" name="nombre" placeholder="Escribe tu nombre" required />

            <label htmlFor="contact-email">Correo</label>
            <input id="contact-email" name="correo" type="email" placeholder="tucorreo@ejemplo.com" required />

            <label htmlFor="contact-topic">Tema</label>
            <input id="contact-topic" name="tema" placeholder="Voluntariado, rescate, donación, otra" />

            <label htmlFor="contact-message">Mensaje</label>
            <textarea id="contact-message" name="mensaje" rows="5" placeholder="Cuéntanos cómo podemos ayudarte" required />

            <button className="button button--primary" type="submit">
              Enviar mensaje
            </button>

            {message && <p className="form-message form-message--success">{message}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}
