import { useState } from 'react';
import api from './utils/api';

export default function TutorLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setStatus({ type: 'error', message: 'Ingresa tu correo y contraseña.' });
      return;
    }
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await api.post('/auth/login/tutor', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tutor', JSON.stringify(response.data.tutor));
      setStatus({ type: 'success', message: response.data.message });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'No fue posible iniciar sesión.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell auth-shell">
      <section className="intro-panel">
        <span className="brand-mark">E</span>
        <p className="eyebrow">EDUCONNECT</p>
        <h1>Administra tus tutorías con claridad.</h1>
        <p className="intro-copy">Accede a tus horarios, disponibilidad y sesiones desde un solo lugar.</p>
      </section>
      <section className="form-panel">
        <div className="form-heading">
          <p className="eyebrow">ACCESO DE TUTOR</p>
          <h2>Inicia sesión</h2>
          <p>Solo las cuentas aprobadas pueden ingresar.</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label><span>Correo electrónico</span><input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required /></label>
          <label><span>Contraseña</span><input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required /></label>
          {status.message && <div className={`feedback ${status.type}`}>{status.message}</div>}
          <button className="submit-button" type="submit" disabled={submitting}>{submitting ? 'Validando…' : 'Ingresar'}</button>
          <p className="form-link">¿Aún no tienes cuenta? <a href="/register">Regístrate como tutor</a></p>
        </form>
      </section>
    </main>
  );
}
