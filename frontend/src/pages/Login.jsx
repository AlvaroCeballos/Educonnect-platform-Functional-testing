import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'student',
    token: '',
  });
  const [showTokenField, setShowTokenField] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      if (form.role === 'admin') {
        const response = await api.post('/auth/login/admin', {
          email: form.email,
          password: form.password,
        });
        navigate('/login/admin/2fa', { state: { adminData: response.data } });
      } else if (form.role === 'student') {
        const payload = {
          email: form.email,
          password: form.password,
          ...(form.token && { token: form.token.trim() }),
        };
        const response = await api.post('/auth/login/student', payload);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('student', JSON.stringify(response.data.student));
        navigate('/dashboard/student');
      } else if (form.role === 'tutor') {
        const payload = {
          email: form.email,
          password: form.password,
          ...(form.token && { token: form.token.trim() }),
        };
        const response = await api.post('/auth/login/tutor', payload);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tutor', JSON.stringify(response.data.tutor));
        navigate('/tutor/dashboard');
      }
    } catch (error) {
      const respData = error.response?.data;
      if (respData?.requiresToken) {
        setShowTokenField(true);
      }
      setStatus({
        type: 'error',
        message: respData?.message || 'Error al iniciar sesión',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      <div className="hidden lg:flex flex-col justify-center w-5/12 bg-teal-800 text-white p-16">
        <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6">
          E
        </div>
        <h1 className="text-sm tracking-widest font-semibold text-teal-300 mb-4">
          EDUCONNECT
        </h1>
        <h2 className="text-5xl font-extrabold leading-tight mb-6">
          Conecta con expertos.
        </h2>
        <p className="text-teal-100 text-lg">
          Accede a tutorías personalizadas y gestiona tu aprendizaje con seguridad.
        </p>
      </div>

      <div className="flex w-full lg:w-7/12 bg-gray-50 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h3 className="text-xs font-bold text-teal-600 tracking-widest uppercase mb-2">
            Acceso a la plataforma
          </h3>
          <h4 className="text-3xl font-light text-gray-800 mb-2">Inicia sesión</h4>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tipo de usuario
              </label>
              <select
                name="role"
                value={form.role}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value === 'admin') setShowTokenField(false);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="student">Estudiante</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Campo dinámico de Token (HU-031) */}
            {form.role !== 'admin' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    Token de verificación
                    {showTokenField && (
                      <span className="ml-1 text-xs text-teal-700 font-bold">
                        (Obligatorio en primer ingreso)
                      </span>
                    )}
                  </label>
                  {!showTokenField && (
                    <button
                      type="button"
                      onClick={() => setShowTokenField(true)}
                      className="text-xs text-teal-700 font-semibold hover:underline"
                    >
                      ¿Es tu primer inicio?
                    </button>
                  )}
                </div>

                {showTokenField && (
                  <div className="relative">
                    <input
                      type="text"
                      name="token"
                      maxLength={10}
                      placeholder="Ej. A8X9K2"
                      value={form.token}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-teal-500 rounded-lg bg-teal-50/50 uppercase tracking-widest font-mono font-bold text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ingresa el código alfanumérico de 6 dígitos que te enviamos a tu correo al registrarte.
                    </p>
                  </div>
                )}
              </div>
            )}

            {status.message && (
              <div
                className={`border text-sm rounded-lg px-4 py-3 ${
                  status.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 text-white font-bold py-3 rounded-lg hover:bg-teal-800 disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Verificando credenciales...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registro" className="text-teal-700 font-bold hover:underline">
              Regístrate como Estudiante
            </Link>{' '}
            o{' '}
            <Link to="/register" className="text-teal-700 font-bold hover:underline">
              Tutor
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}