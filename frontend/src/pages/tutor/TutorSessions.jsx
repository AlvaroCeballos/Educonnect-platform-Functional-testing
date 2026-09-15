import { useState, useEffect } from 'react';

export default function TutorSessions() {
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    // T-015.1: Datos simulados para armar la UI antes de conectar el backend
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
    setIsModalOpen(true);
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden p-6 text-center">
            <h3 className="font-bold text-lg mb-4">Modal base abierto para {activeSession?.materia}</h3>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-slate-200 rounded-lg font-semibold">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}