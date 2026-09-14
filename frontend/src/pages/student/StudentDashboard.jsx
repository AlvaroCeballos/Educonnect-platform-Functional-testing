import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import TutorScheduleModal from '../../components/TutorScheduleModal';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTutorForSchedule, setSelectedTutorForSchedule] = useState(null);

  useEffect(() => {
    const studentData = localStorage.getItem('student');
    const token = localStorage.getItem('token');

    if (!token || !studentData) {
      navigate('/login');
      return;
    }

    setStudent(JSON.parse(studentData));
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Peticiones concurrentes a tutores aprobados y sesiones del estudiante
      const [tutorsRes, sessionsRes] = await Promise.all([
        api.get('/tutors'),
        api.get('/sessions/me'),
      ]);

      const allTutors = tutorsRes.data || [];
      const studentSessions = sessionsRes.data?.sessions || [];

      // Identificar IDs de tutores con sesión activa (PENDING)
      const activeTutorIds = new Set(
        studentSessions
          .filter((s) => s.status === 'PENDING')
          .map((s) => Number(s.tutorId))
      );

      // Criterio HU-009: Excluir tutores con los que ya se tiene una sesión activa
      const available = allTutors.filter(
        (tutor) => !activeTutorIds.has(Number(tutor.id))
      );

      setTutors(available);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'No se pudo cargar el catálogo de tutores disponibles.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Barra de navegación superior */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-lg shadow-sm">
              E
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              EduConnect
            </span>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/mis-sesiones"
              className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Mis Sesiones
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de bienvenida */}
        <section className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-md mb-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-emerald-900/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
              Portal Estudiantil
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bienvenido, {student?.nombre} {student?.apellido}
            </h1>
            <p className="mt-2 text-emerald-100 text-sm sm:text-base leading-relaxed">
              Explora tutores calificados disponibles para agendar una sesión
              académica personalizada.
            </p>
          </div>
        </section>

        {/* Encabezado del catálogo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Tutores Disponibles
            </h2>
            <p className="text-sm text-slate-500">
              Mostrando tutores con disponibilidad inmediata sin citas previas en curso.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="self-start sm:self-auto text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-md transition-colors"
          >
            Actualizar lista
          </button>
        </div>

        {/* Estado de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchDashboardData}
              className="underline font-semibold ml-4 hover:text-red-900"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado de carga (Heurística Nielsen #1) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((skeleton) => (
              <div
                key={skeleton}
                className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-10 bg-slate-100 rounded-md" />
                <div className="h-9 bg-slate-200 rounded-lg mt-2" />
              </div>
            ))}
          </div>
        ) : tutors.length === 0 ? (
          /* Estado vacío */
          <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl mb-3">
              📚
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              No hay tutores disponibles por ahora
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              No se encontraron nuevos tutores o ya tienes sesiones activas pendientes de atención con ellos.
            </p>
            <Link
              to="/mis-sesiones"
              className="mt-5 inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-4 py-2 rounded-lg transition-colors"
            >
              Revisar mis sesiones activas
            </Link>
          </div>
        ) : (
          /* Cuadrícula de tutores */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <article
                key={tutor.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Foto y Nombre Completo */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={
                        tutor.fotografia_url &&
                        tutor.fotografia_url.startsWith('http')
                          ? tutor.fotografia_url
                          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={`Foto de ${tutor.nombre} ${tutor.apellido}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-inner flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {tutor.nombre} {tutor.apellido}
                      </h3>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {tutor.universidad || 'Universidad de San Carlos de Guatemala'}
                      </p>
                      <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Disponible
                      </span>
                    </div>
                  </div>

                  {/* Dirección de Tutoría */}
                  <div className="mb-3.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700 block mb-0.5">
                      Modalidad / Dirección:
                    </span>
                    <span className="truncate block">
                      📍 {tutor.direccion_tutoria || 'Online / Aula Virtual'}
                    </span>
                  </div>

                  {/* Especialidad y Materias */}
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Materias que imparte:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {tutor.materias && tutor.materias.length > 0 ? (
                        tutor.materias.map((materia) => (
                          <span
                            key={materia.id}
                            className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded font-medium border border-slate-200"
                          >
                            {materia.nombre}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          {tutor.especialidad || 'Sin materias asignadas'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones de la tarjeta: Ver Horarios (HU-011) y Programar (HU-012) */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTutorForSchedule(tutor)}
                    className="flex-1 text-center bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors border border-slate-200 shadow-sm"
                  >
                    Ver Horarios
                  </button>
                  <Link
                    to={`/reservar?tutorId=${tutor.id}`}
                    className="flex-1 text-center bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                  >
                    Programar
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modal de consulta de disponibilidad por fecha (HU-011) */}
      {selectedTutorForSchedule && (
        <TutorScheduleModal
          tutor={selectedTutorForSchedule}
          onClose={() => setSelectedTutorForSchedule(null)}
        />
      )}
    </div>
  );
}