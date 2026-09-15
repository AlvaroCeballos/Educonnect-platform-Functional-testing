import { Link, useNavigate } from 'react-router-dom';

export default function TutorDashboard() {
  const navigate = useNavigate();
  // Extraemos los datos del tutor logueado desde el localStorage
  const tutorData = JSON.parse(localStorage.getItem('tutor') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tutor');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col gap-4 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Panel de Control del Tutor</h1>
          <p className="text-lg text-gray-600 mt-2">
            Bienvenido, <span className="font-bold text-teal-700">{tutorData.nombre || 'Tutor'}</span>. ¿Qué deseas gestionar hoy?
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-center rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-700 md:self-start"
          >
            Cerrar sesión
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta de Sesiones */}
          <Link to="/tutor/sesiones" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-teal-500 transition-all group flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-sm">
              📅
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Mis Sesiones</h2>
            <p className="text-sm text-gray-600">
              Visualiza tus próximas tutorías, marca sesiones como atendidas y revisa tu historial de clases impartidas.
            </p>
          </Link>

          {/* Tarjeta de Horarios */}
          <Link to="/schedule" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-amber-500 transition-all group flex flex-col items-center md:items-start text-center md:text-left relative overflow-hidden">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-sm">
              ⏰
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Disponibilidad</h2>
            <p className="text-sm text-gray-600">
              Define o actualiza tus días y horas de atención. <strong className="text-amber-700">Obligatorio</strong> para recibir solicitudes.
            </p>
            {/* Indicador visual para llamar la atención del tutor */}
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Importante
            </div>
          </Link>

          {/* Tarjeta de Perfil */}
          <Link to="/tutor/profile" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-500 transition-all group flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
              👤
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Mi Perfil</h2>
            <p className="text-sm text-gray-600">
              Actualiza tus datos personales, especialidad, experiencia profesional y cambia tu contraseña.
            </p>
          </Link>

        </div>
      </div>
    </div>
  );
}