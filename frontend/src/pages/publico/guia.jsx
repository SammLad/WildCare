import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import deerImage from '../../assets/deer.png';
import '../../assets/styles/home.css';

const learningSteps = [
  {
    title: 'Observa y evalúa',
    text: 'Mira desde lejos, identifica si hay signos de dolor, confusión o peligro real y evita acercarte de forma brusca.',
  },
  {
    title: 'No lo manipules sin apoyo',
    text: 'La reacción del animal puede empeorar si se toca, se mueve o se fuerza a salir de su hábitat.',
  },
  {
    title: 'Reporta con detalles',
    text: 'Comparte especie, ubicación y detalles del caso para que el equipo pueda responder con rapidez.',
  },
  {
    title: 'Mantén la calma',
    text: 'Tu tranquilidad ayuda a que la comunidad actúe con responsabilidad y evita empujar una situación inestable.',
  },
];

export default function GuidePage() {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowBubble(true), 260);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="page-shell">
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

      <main className="page-main">
        <section className="page-hero">
          <div className="page-copy">
            <span className="eyebrow">Guía de aprendizaje</span>
            <h1>Actúa con calma y ayuda a proteger la vida silvestre.</h1>
            <p>
              Cuando encontramos un animal silvestre en riesgo, la mejor ayuda es la información, la paciencia y la coordinación.
            </p>
            <div className="page-actions">
              <Link className="button button--primary" to="/">
                Volver al inicio
              </Link>
              <Link className="button button--outline" to="/donacion">
                Apoyar la causa
              </Link>
            </div>
          </div>

          <div className={`deer-scene ${showBubble ? 'is-visible' : ''}`} aria-label="Ilustración animada de un venado">
            <div className="speech-bubble">¡Todo está bien! Primero observa, luego reporta con calma.</div>
            <div className="deer-figure">
              <div className="deer-body" />
              <div className="deer-head">
                <span className="antler antler-left" />
                <span className="antler antler-right" />
                <span className="ear ear-left" />
                <span className="ear ear-right" />
                <span className="eye" />
                <span className="nose" />
              </div>
              <div className="deer-leg deer-leg--front" />
              <div className="deer-leg deer-leg--middle" />
              <div className="deer-leg deer-leg--rear" />
              <div className="tail" />
            </div>
          </div>
        </section>

        <section className="guidance-grid" aria-label="Pasos para ayudar a fauna silvestre">
          {learningSteps.map((step, index) => (
            <article className="guidance-card" key={step.title}>
              <span className="guidance-index">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
