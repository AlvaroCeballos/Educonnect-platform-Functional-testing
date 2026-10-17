import { useState, useEffect } from 'react';
import api from '../../utils/api';
import IncidentReportForm from '../../components/IncidentReportForm';
import StudentRatingForm from '../../components/StudentRatingForm';

export default function TutorSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('PENDING');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [dificultadesDetectadas, setDificultadesDetectadas] = useState('');
  const [recursos, setRecursos] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState(null);
  const [cancelError, setCancelError] = useState('');
  const [canceling, setCanceling] = useState(false);
  const [ratings, setRatings] = useState({});
  const [incidents, setIncidents] = useState({});

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const [response, ratingsResponse, incidentsResponse] = await Promise.all([
        api.get('/sessions/tutor/me'),
        api.get('/ratings/tutor/me'),
        api.get('/incidents/tutor/me'),
      ]);
      setSessions(response.data.sessions);
      setRatings(Object.fromEntries(
        (ratingsResponse.data.ratings || []).map((rating) => [rating.sessionId, rating]),
      ));
      setIncidents(Object.fromEntries(
        (incidentsResponse.data.incidents || []).map((incident) => [incident.sessionId, incident]),
      ));
    } catch (err) {
      setError('No se pudieron cargar tus sesiones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const openModal = (session) => {
    setActiveSession(session);
    setDificultadesDetectadas('');
    setRecursos([]);
    setSubmitError('');
    setIsModalOpen(true);
  };

  const openCancelModal = (session) => {
    setSessionToCancel(session);
    setCancelError('');
    setIsCancelModalOpen(true);
  };

  const handleAttend = async (e) => {
    e.preventDefault();
    if (!dificultadesDetectadas.trim()) {
      setSubmitError('Las dificultades identificadas son obligatorias.');
      return;
    }
    if (recursos.length === 0) {
      setSubmitError('Agregá al menos un recurso recomendado antes de guardar el plan.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await api.post('/study-plans', {
        session_id: activeSession.id,
        dificultades_detectadas: dificultadesDetectadas,
        recursos,
      });
      setIsModalOpen(false);
      setActiveTab('HISTORY');
      fetchSessions();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Error al procesar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setCanceling(true);
    setCancelError('');
    
    try {
      await api.patch(`/sessions/${sessionToCancel.id}/cancel/tutor`);
      setIsCancelModalOpen(false);
      fetchSessions(); 
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Error al cancelar la sesión.');
    } finally {
      setCanceling(false);
    }
  };

  const displayedSessions = activeTab === 'PENDING' 
    ? sessions
        .filter(s => s.status === 'PENDING')
        .sort((a, b) => {
          const dateA = new Date(`${String(a.sessionDate).slice(0, 10)}T${a.startTime}`);
          const dateB = new Date(`${String(b.sessionDate).slice(0, 10)}T${b.startTime}`);
          return dateA - dateB; 
        })
    : sessions.filter(s => s.status !== 'PENDING');

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Mis Sesiones</h2>
      
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('PENDING')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PENDING' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Pendientes por atender
        </button>
        <button 
          onClick={() => setActiveTab('HISTORY')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'HISTORY' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Historial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <p className="text-slate-500 font-medium animate-pulse">Cargando sesiones...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          {error}
        </div>
      ) : displayedSessions.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-slate-500 italic text-lg">No hay sesiones en esta sección.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {displayedSessions.map(session => (
            <div key={session.id} className="p-5 border border-slate-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1">
                  <p className="font-bold text-xl text-slate-800">{session.materia}</p>
                  <p className="text-sm font-medium text-slate-600 mt-1">
                    Estudiante: <span className="text-slate-900">{session.studentNombre} {session.studentApellido}</span>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    📅 {String(session.sessionDate).slice(0, 10)} | ⏰ {session.startTime} - {session.endTime}
                  </p>
                  
                  {session.reason && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 max-w-2xl">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Motivo / Dudas:</p>
                      <p className="text-sm text-gray-700 italic">"{session.reason}"</p>
                    </div>
                  )}

                  {/* T-017.3: Diferenciar visualmente quién canceló la sesión en el historial */}
                  <span className={`inline-block mt-3 px-2.5 py-1 text-xs font-bold rounded-full uppercase ${
                    session.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 
                    session.status === 'ATTENDED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {session.status === 'PENDING' ? 'Pendiente' : 
                     session.status === 'ATTENDED' ? 'Atendida' : 
                     session.status === 'CANCELLED_BY_TUTOR' ? 'Cancelada por ti' : 'Cancelada por est.'}
                  </span>
                </div>
                
                {session.status === 'PENDING' && (
                  <div className="flex gap-3 mt-4 md:mt-0 md:ml-6">
                    <button
                      onClick={() => openCancelModal(session)}
                      className="px-4 py-2 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors shadow-sm whitespace-nowrap"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => openModal(session)}
                      className="bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                      Marcar como Atendida
                    </button>
                  </div>
                )}
              </div>

              {session.status === 'ATTENDED' && (
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-emerald-700">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">✓</span>
                  <span>Plan de estudio registrado para esta sesión.</span>
                </div>
              )}
              {session.status === 'ATTENDED' && !ratings[session.id] && (
                <StudentRatingForm
                  sessionId={session.id}
                  onSubmitted={(rating) => setRatings((current) => ({ ...current, [session.id]: rating }))}
                />
              )}
              {session.status === 'ATTENDED' && !incidents[session.id] && (
                <IncidentReportForm
                  role="tutor"
                  sessionId={session.id}
                  onSubmitted={(incident) => setIncidents((current) => ({ ...current, [session.id]: incident }))}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Atender */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col zoom-in-95">

            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center flex-shrink-0 rounded-t-2xl">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">Cierre de sesión</span>
                <h3 className="font-bold text-lg">{activeSession?.materia}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleAttend} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl px-4 py-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {`${activeSession?.studentNombre?.[0] ?? ''}${activeSession?.studentApellido?.[0] ?? ''}`.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Estudiante</p>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {activeSession?.studentNombre} {activeSession?.studentApellido}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Dificultades Identificadas <span className="text-red-500">*</span></label>
                <textarea
                  value={dificultadesDetectadas}
                  onChange={(e) => setDificultadesDetectadas(e.target.value)}
                  className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none resize-none text-sm"
                  rows="4"
                  placeholder="Describe los temas donde el estudiante presentó mayor dificultad (ej. Derivadas parciales, Sintaxis de Java, Redacción académica)..."
                ></textarea>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-700">Recursos Recomendados <span className="text-red-500">*</span></label>
                  <button
                    type="button"
                    onClick={() => setRecursos([...recursos, { nombre_recurso: '', tipo_recurso: 'Texto', descripcion_uso: '' }])}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Agregar recurso
                  </button>
                </div>

                {recursos.length === 0 ? (
                  <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50">
                    <p className="text-sm text-slate-500 italic">
                      Agregá al menos un recurso recomendado para poder guardar el plan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recursos.map((recurso, idx) => (
                      <div key={idx} className="border border-slate-200 bg-white rounded-lg p-4 relative">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recurso {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setRecursos(recursos.filter((_, i) => i !== idx))}
                            className="text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            aria-label={`Quitar recurso ${idx + 1}`}
                          >
                            ✕ Quitar
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={recurso.nombre_recurso}
                              onChange={(e) => {
                                const next = [...recursos];
                                next[idx] = { ...next[idx], nombre_recurso: e.target.value };
                                setRecursos(next);
                              }}
                              placeholder="Ej. Cálculo de Stewart - Cap. 14"
                              className="w-full border border-slate-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo <span className="text-red-500">*</span></label>
                            <select
                              value={recurso.tipo_recurso}
                              onChange={(e) => {
                                const next = [...recursos];
                                next[idx] = { ...next[idx], tipo_recurso: e.target.value };
                                setRecursos(next);
                              }}
                              className="w-full border border-slate-300 p-2 rounded-md text-sm bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                            >
                              <option value="Texto">Texto</option>
                              <option value="Video">Video</option>
                              <option value="PDF">PDF</option>
                              <option value="Enlace">Enlace</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción de uso <span className="text-red-500">*</span></label>
                          <textarea
                            value={recurso.descripcion_uso}
                            onChange={(e) => {
                              const next = [...recursos];
                              next[idx] = { ...next[idx], descripcion_uso: e.target.value };
                              setRecursos(next);
                            }}
                            placeholder='Ej. "Leer secciones 14.1 a 14.3", "Ver minuto 2:30 a 8:15"'
                            rows="2"
                            className="w-full border border-slate-300 p-2 rounded-md text-sm resize-none focus:ring-2 focus:ring-emerald-600 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
                  {submitError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-5 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    submitting
                    || recursos.length === 0
                    || !dificultadesDetectadas.trim()
                    || recursos.some((r) => !r.nombre_recurso.trim() || !r.descripcion_uso.trim())
                  }
                  className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Guardando...' : 'Guardar y Atender'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal de confirmación para cancelar */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden zoom-in-95">
            <div className="px-6 py-4 bg-red-600 text-white flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-wider text-red-200 font-semibold block">Atención</span>
                <h3 className="font-bold text-lg">Cancelar sesión</h3>
              </div>
              <button onClick={() => setIsCancelModalOpen(false)} className="text-red-200 hover:text-white text-xl">✕</button>
            </div>
            
            <div className="p-6">
              <p className="text-slate-700 mb-4">
                ¿Estás seguro de que deseas cancelar tu tutoría de <strong>{sessionToCancel?.materia}</strong> con <strong>{sessionToCancel?.studentNombre}</strong>?
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Esta acción informará al estudiante, <strong className="text-red-600">liberará tu horario</strong> para nuevas reservas y no se puede deshacer.
              </p>
              
              {cancelError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
                  {cancelError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setIsCancelModalOpen(false)} 
                  disabled={canceling}
                  className="px-5 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Mantener sesión
                </button>
                <button 
                  onClick={handleCancel} 
                  disabled={canceling}
                  className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {canceling ? 'Cancelando...' : 'Sí, Cancelar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
