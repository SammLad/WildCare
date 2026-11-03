import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import Home from './pages/publico/home';
import GuidePage from './pages/publico/guia';
import DonationPage from './pages/publico/donacion';
import ContactPage from './pages/publico/contacto';
import AdminDashboard from './pages/admin/inicio';
import Login from './sections/login';
import Register from './sections/registro';
import { getSession, rolePath, VALID_ROLES } from './servicios/auth';

function RolePortal() {
  const { role } = useParams();
  const session = getSession();

  if (!session) return <Navigate to="/login" replace />;
  if (!VALID_ROLES.includes(role)) {
    return <Navigate to="/" replace />;
  }
  if (normalizeRole(session.rol) !== normalizeRole(role)) {
    return <Navigate to={rolePath(session.rol)} replace />;
  }
  return <AdminDashboard />;
}

function normalizeRole(roleValue) {
  if (!roleValue) return '';
  return String(roleValue).trim().toLowerCase();
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guia" element={<GuidePage />} />
        <Route path="/donacion" element={<DonationPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<Register />} />
        <Route path="/panel/:role" element={<RolePortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}