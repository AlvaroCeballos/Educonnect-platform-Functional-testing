import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

const passwordRules = [
  { label: 'Mínimo 8 caracteres', test: (p) => p.length >= 8 },
  { label: 'Al menos una mayúscula', test: (p) => /[A-Z]/.test(p) },
  { label: 'Al menos una minúscula', test: (p) => /[a-z]/.test(p) },
  { label: 'Al menos un número', test: (p) => /[0-9]/.test(p) },
];

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    carnet: '',
    genero: 'M',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    universidad: 'Universidad de San Carlos de Guatemala',
    carrera: 'Ingeniería en Ciencias y Sistemas',
    email: '',
    password: '',
    confirm: '',
  });
  const [fotografia, setFotografia] = useState(null);
  const [carnetPdf, setCarnetPdf] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('La fotografía debe estar en formato JPG, PNG o WEBP.');
      e.target.value = '';
      setFotografia(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La fotografía no debe superar los 5 MB.');
      e.target.value = '';
      setFotografia(null);
      return;
    }
    setError('');
    setFotografia(file);
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('El carnet escaneado debe ser obligatoriamente un archivo PDF (.pdf).');
      e.target.value = '';
      setCarnetPdf(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo PDF no debe superar los 5 MB.');
      e.target.value = '';
      setCarnetPdf(null);
      return;
    }
    setError('');
    setCarnetPdf(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      return setError('Las contraseñas no coinciden');
    }
    if (!fotografia) {
      return setError('La fotografía reciente es obligatoria');
    }
    if (!carnetPdf) {
      return setError('El archivo PDF con tu carnet escaneado es obligatorio');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('apellido', form.apellido);
      formData.append('carnet', form.carnet);
      formData.append('genero', form.genero);
      formData.append('fecha_nacimiento', form.fecha_nacimiento);
      formData.append('telefono', form.telefono);
      formData.append('direccion', form.direccion);
      formData.append('universidad', form.universidad);
      formData.append('carrera', form.carrera);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('fotografia', fotografia);
      formData.append('carnet_pdf', carnetPdf);

      await api.post('/auth/register/student', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
        <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6">
          E
        </div>
        <h1 className="text-sm tracking-widest font-semibold text-teal-300 mb-4">
          EDUCONNECT
        </h1>
        <h2 className="text-5xl font-extrabold leading-tight mb-6">
          Inicia tu camino académico.
        </h2>
        <p className="text-teal-100 text-lg">
          Únete a nuestra plataforma adjuntando tu fotografía y carnet en PDF. Recibirás un token de verificación en tu correo electrónico.
        </p>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="flex w-full lg:w-7/12 bg-gray-50 items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg my-auto py-6">
          <h3 className="text-xs font-bold text-teal-600 tracking-widest uppercase mb-1">
            Registro de Estudiante
          </h3>
          <h4 className="text-3xl font-light text-gray-800 mb-6">Crea tu cuenta</h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  required
                  value={form.apellido}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Carnet universitario *
                </label>
                <input
                  type="text"
                  name="carnet"
                  required
                  value={form.carnet}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Género *
                </label>
                <select
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Fecha de nacimiento *
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  required
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  required
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Dirección *
              </label>
              <input
                type="text"
                name="direccion"
                required
                value={form.direccion}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Archivos obligatorios Fase 2 (HU-028) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-teal-50/70 p-3.5 rounded-xl border border-teal-200">
              <div>
                <label className="block text-xs font-bold text-teal-900 uppercase mb-1">
                  Fotografía Reciente (JPG/PNG) *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={handlePhotoChange}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-700 file:text-white hover:file:bg-teal-800 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-teal-900 uppercase mb-1">
                  Carnet Escaneado (.PDF) *
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={handlePdfChange}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-900 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Correo electrónico *
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirmar contraseña *
                </label>
                <input
                  type="password"
                  name="confirm"
                  required
                  value={form.confirm}
                  onChange={handleChange}
                  className={`w-full p-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    form.confirm && form.confirm !== form.password
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {form.confirm && form.confirm !== form.password && (
              <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
            )}

            {form.password && (
              <ul className="grid grid-cols-2 gap-1 pt-1">
                {passwordRules.map((rule) => {
                  const ok = rule.test(form.password);
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-xs ${
                        ok ? 'text-teal-600 font-semibold' : 'text-gray-400'
                      }`}
                    >
                      <span>{ok ? '✓' : '○'}</span> {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 text-white font-bold py-3 rounded-lg hover:bg-teal-800 disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-teal-700 font-bold hover:underline">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}