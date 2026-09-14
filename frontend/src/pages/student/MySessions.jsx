import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../utils/api';

const statusLabels = {
  PENDING: 'Pendiente',
  ATTENDED: 'Atendida',
  CANCELLED_BY_STUDENT: 'Cancelada por ti',
  CANCELLED_BY_TUTOR: 'Cancelada por el tutor',
};

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = () => {
    setLoading(true);
    api.get('/sessions/me?status=PENDING').then(({ data }) => setSessions(data.sessions)).finally(() => setLoading(false));
  };

  useEffect(() => { loadSessions(); }, []);

  const cancelSession = async (session) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: '¿Cancelar sesión?',
      text: `${session.tutorNombre} ${session.tutorApellido} — ${session.sessionDate.slice(0, 10)} a las ${session.startTime.slice(0, 5)}`,
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#a42e3a',
      cancelButtonColor: '#167963',
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.patch(`/sessions/${session.id}/cancel`);
      await Swal.fire({ icon: 'success', title: 'Sesión cancelada', confirmButtonColor: '#167963' });
      loadSessions();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo cancelar',
        text: error.response?.data?.message || 'Intenta de nuevo.',
        confirmButtonColor: '#167963',
      });
    }
  };

  return <main className="single-panel"><section className="form-panel schedule-panel">
    <div style={{ marginBottom: '14px' }}>
      <Link
        to="/dashboard/student"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#0f766e',
          textDecoration: 'none',
        }}
      >
        ← Volver a tutores disponibles
      </Link>
    </div>
    <div className="form-heading"><p className="eyebrow">MIS SESIONES ACTIVAS</p><h2>Sesiones activas</h2><p>Tus próximas sesiones pendientes, ordenadas por fecha más cercana.</p></div>
    {loading && <p>Cargando…</p>}
    {!loading && sessions.length === 0 && <p>No tienes sesiones activas en este momento.</p>}
    <div className="session-list">
      {sessions.map((session) => (
        <div key={session.id} className="session-card">
          <div>
            <strong>{session.tutorNombre} {session.tutorApellido}</strong> — {session.materia}
            <p>{session.sessionDate.slice(0, 10)} · {session.startTime.slice(0, 5)} a {session.endTime.slice(0, 5)}</p>
            <p>{session.reason}</p>
          </div>
          <div className="session-actions">
            <span className={`status-badge status-${session.status.toLowerCase()}`}>{statusLabels[session.status] || session.status}</span>
            {session.status === 'PENDING' && (
              <button className="cancel-button" type="button" onClick={() => cancelSession(session)}>Cancelar</button>
            )}
          </div>
        </div>
      ))}
    </div>
  </section></main>;
}
