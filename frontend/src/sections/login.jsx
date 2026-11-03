import React from "react";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import deerIcon from '../assets/deer.png';
import { DEMO_ACCOUNTS, ROLE_LABELS, rolePath, signIn } from '../servicios/auth';
import '../assets/styles/login.css';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const session = signIn(identifier, password);
      navigate(rolePath(session.rol), { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-decor auth-decor-left" aria-hidden="true" />
      <div className="auth-decor auth-decor-right" aria-hidden="true" />

      <section className="auth-card" aria-labelledby="login-title">
        <Link className="auth-brand" to="/">
          <img className="brand__mark" src={deerIcon} alt="" />
          <span>Wild Care</span>
        </Link>
        <p className="auth-eyebrow">Tu comunidad de cuidado animal</p>
        <h1 id="login-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Ingresa para continuar a tu espacio de trabajo.</p>

        {error && (
          <p className="form-message form-message--error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="identifier">Correo o nombre de usuario</label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="nombre@correo.com"
            autoComplete="username"
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Escribe tu contraseña"
            autoComplete="current-password"
            required
          />

          <button className="button button--primary auth-submit" type="submit">
            Ingresar
          </button>
        </form>

        <aside className="demo-credentials">
          <strong>Cuentas de prueba por rol</strong>
          {DEMO_ACCOUNTS.map((account) => (
            <span key={account.email}>
              {ROLE_LABELS[account.rol || 'admin']}: {account.email} / {account.password}
            </span>
          ))}
        </aside>

        <p className="auth-switch">
          ¿Aún no tienes cuenta? <Link to="/crear-cuenta">Crear cuenta</Link>
        </p>
        <Link className="auth-back" to="/">
          ← Volver al inicio público
        </Link>
      </section>
    </main>
  );
}