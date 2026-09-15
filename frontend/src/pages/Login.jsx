import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      if (form.role === 'admin') {
        const response = await api.post('/auth/login/admin', { email: form.email, password: form.password });
        navigate('/login/admin/2fa', { state: { adminData: response.data } });
      } 
      else if (form.role === 'student') {
        const response = await api.post('/auth/login/student', { email: form.email, password: form.password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('student', JSON.stringify(response.data.student));
        navigate('/dashboard/student');
      } 
      else if (form.role === 'tutor') {
        const response = await api.post('/auth/login/tutor', { email: form.email, password: form.password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tutor', JSON.stringify(response.data.tutor));
        
        // REDIRECCIÓN ACTUALIZADA AL NUEVO DASHBOARD
        navigate('/tutor/dashboard');
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Error al iniciar sesión' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      <div className="hidden lg:flex flex-col justify-center w-5/12 bg-teal-800 text-white p-16">
        <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6">E</div>
        <h1 className="text-sm tracking-widest font-semibold text-teal-300 mb-4">EDUCONNECT</h1>
        <h2 className="text-5xl font-extrabold leading-tight mb-6">Conecta con expertos.</h2>
        <p className="text-teal-100 text-lg">Accede a tutorías personalizadas y gestiona tu aprendizaje.</p>
      </div>

      <div className="flex w-full lg:w-7/12 bg-gray-50 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h3 className="text-xs font-bold text-teal-600 tracking-widest uppercase mb-2">Acceso a la plataforma</h3>
          <h4 className="text-3xl font-light text-gray-800 mb-2">Inicia sesión</h4>
          
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de usuario</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="student">Estudiante</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            {status.message && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {status.message}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-teal-700 text-white font-bold py-3 rounded-lg hover:bg-teal-800 disabled:opacity-50 transition-colors mt-4">
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            ¿Aún no tienes cuenta? <Link to="/registro" className="text-teal-700 font-bold hover:underline">Estudiante</Link> o <Link to="/register" className="text-teal-700 font-bold hover:underline">Tutor</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}