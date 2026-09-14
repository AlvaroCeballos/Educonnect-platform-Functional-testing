import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

const passwordRules = [
  { label: 'Mínimo 8 caracteres',      test: (p) => p.length >= 8 },
  { label: 'Al menos una mayúscula',   test: (p) => /[A-Z]/.test(p) },
  { label: 'Al menos una minúscula',   test: (p) => /[a-z]/.test(p) },
  { label: 'Al menos un número',       test: (p) => /[0-9]/.test(p) },
];

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', apellido: '', carnet: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Las contraseñas no coinciden');
    setLoading(true);
    try {
      await api.post('/auth/register/student', {
        nombre: form.nombre, apellido: form.apellido, carnet: form.carnet, email: form.email, password: form.password,
      });
      navigate('/registro-exitoso');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Panel Izquierdo - Branding */}
      <div className="hidden lg:flex flex-col justify-center w-5/12 bg-teal-800 text-white p-16">
        <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6">E</div>
        <h1 className="text-sm tracking-widest font-semibold text-teal-300 mb-4">EDUCONNECT</h1>
        <h2 className="text-5xl font-extrabold leading-tight mb-6">Inicia tu camino académico.</h2>
        <p className="text-teal-100 text-lg">Únete a nuestra plataforma y encuentra al tutor ideal para alcanzar tus metas.</p>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="flex w-full lg:w-7/12 bg-gray-50 items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md my-auto py-8">
          <h3 className="text-xs font-bold text-teal-600 tracking-widest uppercase mb-2">Registro de Estudiante</h3>
          <h4 className="text-3xl font-light text-gray-800 mb-6">Crea tu cuenta</h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                <input type="text" name="nombre" required value={form.nombre} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
                <input type="text" name="apellido" required value={form.apellido} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Carnet universitario</label>
              <input type="text" name="carnet" required value={form.carnet} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <input type="password" name="password" required value={form.password} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              {form.password && (
                <ul className="mt-2 space-y-1">
                  {passwordRules.map((rule) => {
                    const ok = rule.test(form.password);
                    return (
                      <li key={rule.label} className={`flex items-center gap-2 text-xs ${ok ? 'text-teal-600 font-semibold' : 'text-gray-400'}`}>
                        <span>{ok ? '✓' : '○'}</span> {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar contraseña</label>
              <input type="password" name="confirm" required value={form.confirm} onChange={handleChange} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${form.confirm && form.confirm !== form.password ? 'border-red-400' : 'border-gray-300'}`} />
              {form.confirm && form.confirm !== form.password && <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>}
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-teal-700 text-white font-bold py-3 rounded-lg hover:bg-teal-800 disabled:opacity-50 transition-colors mt-4">
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta? <Link to="/login" className="text-teal-700 font-bold hover:underline">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}