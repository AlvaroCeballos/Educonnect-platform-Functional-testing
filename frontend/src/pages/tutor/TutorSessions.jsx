import { useState, useEffect } from 'react';

export default function TutorSessions() {
  const [sessions, setSessions] = useState([]);
  
  // Estados para controlar el Modal (T-015.2)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [summary, setSummary] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Seguimos usando la data simulada temporalmente
    setSessions([
      { 
        id: 1, 
        sessionDate: '2026-09-20', 
        startTime: '10:00:00', 
        endTime: '11:00:00', 
        materia: 'Física Avanzada', 
        status: 'PENDING', 
        studentNombre: 'Juan', 
        studentApellido: 'Pérez' 
      }
    ]);
  }, []);

  const openModal = (session) => {
    setActiveSession(session);
    setSummary('');
    setRecommendations('');
    setSubmitError('');
    setIsModalOpen(true);
  };

  // T-015.2: Lógica de validación del formulario
  const handleAttend = (e) => {
    e.preventDefault();
    if (!summary.trim()) {
        setSubmitError('El resumen es obligatorio para poder cerrar la sesión.');
        return;
    }
    
    // Por ahora solo imprimimos en consola, en T-015.4 lo conectaremos al backend
    console.log('Datos validados listos para enviar:', { summary, recommendations });
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Mis Sesiones</h2>
      
      <div className="grid gap-5">
        {sessions.map(session => (
          <div key={session.id} className="p-5 border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center bg-white">
            <div>
              <p className="font-bold text-xl text-slate-800">{session.materia}</p>
              <p className="text-sm font-medium text-slate-600 mt-1">
                Estudiante: <span className="text-slate-900">{session.studentNombre} {session.studentApellido}</span>
              </p>
              <p className="text-sm text-slate-500 mt-1">
                📅 {session.sessionDate} | ⏰ {session.startTime} - {session.endTime}
              </p>
              <span className="inline-block mt-3 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 uppercase">
                {session.status}
              </span>
            </div>
            
            {session.status === 'PENDING' && (
              <button
                onClick={() => openModal(session)}
                className="mt-4 md:mt-0 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Marcar como Atendida
              </button>
            )}
          </div>
        ))}
      </div>

      {/* T-015.2: Maquetación del Modal con el formulario de cierre */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden zoom-in-95">
            
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">Cierre de sesión</span>
                <h3 className="font-bold text-lg">{activeSession?.materia}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            
            <form onSubmit={handleAttend} className="p-6 space-y-5">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                 <p className="text-sm text-slate-600">
                   Estudiante: <strong className="text-slate-900">{activeSession?.studentNombre} {activeSession?.studentApellido}</strong>
                 </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Resumen de la sesión <span className="text-red-500">*</span></label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none resize-none text-sm"
                  rows="4"
                  placeholder="Describe detalladamente los temas tratados, ejercicios resueltos y progreso..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Recomendaciones <span className="text-slate-400 font-normal">(Opcional)</span></label>
                <textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none resize-none text-sm"
                  rows="3"
                  placeholder="Sugerencias de estudio, bibliografía o áreas a reforzar..."
                ></textarea>
              </div>
              
              {/* Mensaje de error de validación */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
                  {submitError}
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Guardar y Atender
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}