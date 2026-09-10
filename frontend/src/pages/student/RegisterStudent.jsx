import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

// Reglas de contraseña 
const passwordRules = [
  { label: 'Mínimo 8 caracteres',      test: (p) => p.length >= 8 },
  { label: 'Al menos una mayúscula',   test: (p) => /[A-Z]/.test(p) },
  { label: 'Al menos una minúscula',   test: (p) => /[a-z]/.test(p) },
  { label: 'Al menos un número',       test: (p) => /[0-9]/.test(p) },
];

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', apellido: '', carnet: '', email: '', password: '', confirm: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm)
      return setError('Las contraseñas no coinciden');

    setLoading(true);
    try {
      await api.post('/auth/register/student', {
        nombre:   form.nombre,
        apellido: form.apellido,
        carnet:   form.carnet,
        email:    form.email,
        password: form.password,
      });
      navigate('/registro-exitoso');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">EduConnect</h1>
          <p className="text-gray-500 mt-1">Crear cuenta de estudiante</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text" name="nombre" required
                value={form.nombre} onChange={handleChange}
                placeholder="Juan"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text" name="apellido" required
                value={form.apellido} onChange={handleChange}
                placeholder="Pérez"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Carnet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carnet universitario
            </label>
            <input
              type="text" name="carnet" required
              value={form.carnet} onChange={handleChange}
              placeholder="202300001"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="juan@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contraseña + indicador en tiempo real */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password" name="password" required
              value={form.password} onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Indicador de reglas en tiempo real (Nielsen: prevención de errores) */}
            {form.password && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => {
                  const ok = rule.test(form.password);
                  return (
                    <li key={rule.label}
                        className={`flex items-center gap-2 text-xs ${ok ? 'text-green-600' : 'text-gray-400'}`}>
                      <span>{ok ? '✓' : '○'}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password" name="confirm" required
              value={form.confirm} onChange={handleChange}
              placeholder="••••••••"
              className={`w-full border rounded-lg px-3 py-2 text-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${form.confirm && form.confirm !== form.password
                            ? 'border-red-400' : 'border-gray-300'}`}
            />
            {form.confirm && form.confirm !== form.password && (
              <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
            )}
          </div>

          {/* Error general del servidor */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm
                            rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                       text-white font-semibold py-2.5 rounded-lg transition-colors">
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}