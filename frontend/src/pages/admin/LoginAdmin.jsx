import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase1Complete, setPhase1Complete] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login/admin', {
        email: form.email,
        password: form.password,
      });

      // Fase 1 completada, necesita archivo 2FA
      setAdminData(response.data);
      setPhase1Complete(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">EduConnect</h1>
          <p className="text-gray-500 mt-1">Administrador</p>
        </div>

        {/* Fase 1: Email y contraseña */}
        {!phase1Complete ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="admin@educonnect.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm
                              rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                         text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Verificando...' : 'Siguiente'}
            </button>
          </form>
        ) : (
          /* Fase 2: Indicador de que necesita archivo 2FA */
          <div className="text-center">
            <div className="text-5xl mb-4"> </div>
            <p className="text-gray-700 font-semibold mb-2">Fase 1 completada</p>
            <p className="text-gray-500 text-sm mb-6">
              Por favor, ingrese el archivo <code className="bg-gray-100 px-2 py-1 rounded">auth2-ayd1.txt</code> en la siguiente pantalla
            </p>
            <button
              onClick={() => navigate('/login/admin/2fa', { state: { adminData } })}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg
                         hover:bg-blue-700 transition-colors"
            >
              Continuar a Fase 2
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No eres administrador?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Volver
          </Link>
        </p>
      </div>
    </div>
  );
}