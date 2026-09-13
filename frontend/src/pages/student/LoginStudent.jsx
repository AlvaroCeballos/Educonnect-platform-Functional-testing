import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function LoginStudent() {
  const navigate = useNavigate();
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
      const response = await api.post('/auth/login/student', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('student', JSON.stringify(response.data.student));
      setStatus({ type: 'success', message: response.data.message });
      navigate('/dashboard/student');
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
        <h1>Conecta con tutores expertos.</h1>
        <p className="intro-copy">Accede a tutorías personalizadas y mejora tu desempeño académico.</p>
      </section>
      <section className="form-panel">
        <div className="form-heading">
          <p className="eyebrow">ACCESO DE ESTUDIANTE</p>
          <h2>Inicia sesión</h2>
          <p>Solo las cuentas aprobadas pueden ingresar.</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label><span>Correo electrónico</span><input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required /></label>
          <label><span>Contraseña</span><input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required /></label>
          {status.message && <div className={`feedback ${status.type}`}>{status.message}</div>}
          <button className="submit-button" type="submit" disabled={submitting}>{submitting ? 'Validando…' : 'Ingresar'}</button>
          <p className="form-link">¿Aún no tienes cuenta? <a href="/registro">Regístrate como estudiante</a></p>
        </form>
      </section>
    </main>
  );
}
