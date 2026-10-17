import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import IncidentReportForm from '../../components/IncidentReportForm';

const statusLabels = {
  ATTENDED: 'Atendida',
  CANCELLED_BY_STUDENT: 'Cancelada por ti',
  CANCELLED_BY_TUTOR: 'Cancelada por el tutor',
};

export default function SessionHistory() {
  const [sessions, setSessions] = useState([]);
  const [ratings, setRatings] = useState({});
  const [incidents, setIncidents] = useState({});
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/sessions/me'), api.get('/ratings/me'), api.get('/incidents/me')]).then(([sessionsResponse, ratingsResponse, incidentsResponse]) => {
      const historial = (sessionsResponse.data.sessions || [])
        .filter((session) => session.status !== 'PENDING')
        .sort((a, b) => `${b.sessionDate}${b.startTime}`.localeCompare(`${a.sessionDate}${a.startTime}`));
      const ratingMap = Object.fromEntries(
        (ratingsResponse.data.ratings || []).map((rating) => [rating.sessionId, rating]),
      );
      setSessions(historial);
      setRatings(ratingMap);
      setIncidents(Object.fromEntries(
        (incidentsResponse.data.incidents || []).map((incident) => [incident.sessionId, incident]),
      ));
    }).finally(() => setLoading(false));
  }, []);

  const updateDraft = (sessionId, changes) => {
    setDrafts((current) => ({
      ...current,
      [sessionId]: { rating: 0, comment: '', ...current[sessionId], ...changes },
    }));
  };

  const submitRating = async (event, session) => {
    event.preventDefault();
    const draft = drafts[session.id] || { rating: 0, comment: '' };
    try {
      const { data } = await api.post(`/ratings/sessions/${session.id}`, {
        rating: draft.rating,
        comment: draft.comment.trim() || null,
      });
      setRatings((current) => ({ ...current, [session.id]: data.rating }));
      setDrafts((current) => {
        const next = { ...current };
        delete next[session.id];
        return next;
      });
      await Swal.fire({ icon: 'success', title: 'Calificación registrada', confirmButtonColor: '#167963' });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo registrar la calificación',
        text: error.response?.data?.message || 'Intenta de nuevo.',
        confirmButtonColor: '#167963',
      });
    }
  };

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
            {session.status === 'ATTENDED' && !ratings[session.id] && (
              <form className="rating-panel" onSubmit={(event) => submitRating(event, session)}>
                <strong>Califica al tutor</strong>
                <div className="star-rating" aria-label="Selecciona una calificación de 0 a 5 estrellas">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const selectedRating = drafts[session.id]?.rating ?? 0;
                    return (
                      <button
                        key={star}
                        className={`star-button${selectedRating >= star ? ' selected' : ''}`}
                        type="button"
                        aria-label={`${star} estrellas`}
                        aria-pressed={selectedRating === star}
                        onClick={() => updateDraft(session.id, { rating: star })}
                      >
                        {selectedRating >= star ? '★' : '☆'}
                      </button>
                    );
                  })}
                  <button
                    className={`zero-rating${(drafts[session.id]?.rating ?? 0) === 0 ? ' selected' : ''}`}
                    type="button"
                    onClick={() => updateDraft(session.id, { rating: 0 })}
                  >
                    0 estrellas
                  </button>
                </div>
                <textarea
                  className="rating-comment"
                  maxLength="1000"
                  placeholder="Comentario opcional"
                  value={drafts[session.id]?.comment ?? ''}
                  onChange={(event) => updateDraft(session.id, { comment: event.target.value })}
                />
                <button className="submit-button rating-submit" type="submit">Enviar calificación</button>
              </form>
            )}
            {session.status === 'ATTENDED' && ratings[session.id] && (
              <p className="rating-summary">
                <strong>Tu calificación:</strong> {'★'.repeat(ratings[session.id].rating)}{'☆'.repeat(5 - ratings[session.id].rating)}
              </p>
            )}
            {session.status === 'ATTENDED' && !incidents[session.id] && (
              <IncidentReportForm
                role="student"
                sessionId={session.id}
                onSubmitted={(incident) => setIncidents((current) => ({ ...current, [session.id]: incident }))}
              />
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
