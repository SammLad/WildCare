import React from "react";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCitizen } from '../servicios/auth';
import '../assets/styles/login.css';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      registerCitizen(form);
      navigate('/', { replace: true, state: { notice: '¡Cuenta creada! Ya puedes iniciar sesión como usuario.' } });
    } catch (registrationError) {
      setError(registrationError.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-title">
        <Link className="auth-brand" to="/">
          <span>🐾</span>
          <span>Wild Care</span>
        </Link>
        <p className="auth-eyebrow">Únete a la comunidad</p>
        <h1 id="register-title">Crear cuenta</h1>
        <p className="auth-subtitle">Regístrate para apoyar rescates y reportar animales silvestres en peligro.</p>

        {error && (
          <p className="form-message form-message--error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="nombre">Nombre completo</label>
          <input id="nombre" name="nombre" value={form.nombre} onChange={updateField} autoComplete="name" required />

          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required />

          <label htmlFor="new-password">Contraseña</label>
          <input id="new-password" name="password" type="password" minLength="8" value={form.password} onChange={updateField} autoComplete="new-password" required />

          <label htmlFor="confirm-password">Confirmar contraseña</label>
          <input id="confirm-password" name="confirmPassword" type="password" minLength="8" value={form.confirmPassword} onChange={updateField} autoComplete="new-password" required />

          <button className="button button--primary auth-submit" type="submit">
            Crear cuenta
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
        <Link className="auth-back" to="/">
          ← Volver al inicio público
        </Link>
      </section>
    </main>
  );
}