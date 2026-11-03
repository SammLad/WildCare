import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import deerImage from '../../assets/deer.png';
import '../../assets/styles/home.css';

export default function DonationPage() {
  const presetAmounts = [50000, 100000, 250000, 500000];
  const [amount, setAmount] = useState('20000');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const value = Number(amount);

    if (!Number.isFinite(value) || value < 20000) {
      setMessage('El monto mínimo de apoyo es de $20.000 COP.');
      return;
    }

    const donations = JSON.parse(localStorage.getItem('anima_donations') || '[]');
    const nextDonations = [
      { id: `DON-${Date.now()}`, monto: value, fecha: new Date().toISOString() },
      ...donations,
    ];

    localStorage.setItem('anima_donations', JSON.stringify(nextDonations));
    setMessage(`¡Gracias! Registramos tu aporte de $${value.toLocaleString('es-CO')} para apoyar rescates y refugios.`);
    setAmount('20000');
  }

  function handlePresetSelect(value) {
    setAmount(String(value));
    setMessage('');
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
        <section className="page-panel">
          <div className="page-copy page-copy--centered">
            <span className="eyebrow">Donación</span>
            <h1>Tu apoyo salva vidas silvestres.</h1>
            <p>
              Cada aporte ayuda a cubrir transporte, atención veterinaria, alimentación y refugio para animales en recuperación.
            </p>
          </div>

          <form className="page-form donation-form" onSubmit={handleSubmit}>
            <label htmlFor="donation-amount">Monto de apoyo en COP</label>
            <div className="amount-pills" aria-label="Montos sugeridos">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`amount-pill ${Number(amount) === preset ? 'is-selected' : ''}`}
                  onClick={() => handlePresetSelect(preset)}
                >
                  ${preset.toLocaleString('es-CO')}
                </button>
              ))}
            </div>
            <input
              id="donation-amount"
              type="number"
              min="20000"
              step="1000"
              placeholder="Ej. 150000"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
            <button className="button button--primary" type="submit">
              Hacer donación
            </button>
            {message && <p className="form-message form-message--success">{message}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}
