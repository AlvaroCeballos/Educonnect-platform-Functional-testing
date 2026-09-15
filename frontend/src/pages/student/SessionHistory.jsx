import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const statusLabels = {
  ATTENDED: 'Atendida',
  CANCELLED_BY_STUDENT: 'Cancelada por ti',
  CANCELLED_BY_TUTOR: 'Cancelada por el tutor',
};

export default function SessionHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/sessions/me').then(({ data }) => {
      const historial = (data.sessions || [])
        .filter((session) => session.status !== 'PENDING')
        .sort((a, b) => `${b.sessionDate}${b.startTime}`.localeCompare(`${a.sessionDate}${a.startTime}`));
      setSessions(historial);
    }).finally(() => setLoading(false));
  }, []);

  return <main className="single-panel"><section className="form-panel schedule-panel">
    <div style={{ marginBottom: '14px' }}>
      <Link to="/mis-sesiones" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#0f766e', textDecoration: 'none' }}>
        ← Volver a mis sesiones activas
      </Link>
    </div>
    <div className="form-heading"><p className="eyebrow">HISTORIAL</p><h2>Historial de sesiones</h2><p>Tus sesiones atendidas y canceladas, de la más reciente a la más antigua.</p></div>
    {loading && <p>Cargando…</p>}
    {!loading && sessions.length === 0 && <p>Todavía no tienes sesiones en tu historial.</p>}
    <div className="session-list">
      {sessions.map((session) => (
        <div key={session.id} className="session-card">
          <div>
            <strong>{session.tutorNombre} {session.tutorApellido}</strong> — {session.materia}
            <p>{session.sessionDate.slice(0, 10)} · {session.startTime.slice(0, 5)} a {session.endTime.slice(0, 5)}</p>
            <p>{session.reason}</p>
            {session.status === 'ATTENDED' && session.summary && (
              <p><strong>Resumen del tutor:</strong> {session.summary}</p>
            )}
            {session.status === 'ATTENDED' && session.recommendations && (
              <p><strong>Recomendaciones:</strong> {session.recommendations}</p>
            )}
          </div>
          <div className="session-actions">
            <span className={`status-badge status-${session.status.toLowerCase()}`}>{statusLabels[session.status] || session.status}</span>
          </div>
        </div>
      ))}
    </div>
  </section></main>;
}
