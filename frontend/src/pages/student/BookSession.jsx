import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../utils/api';

export default function BookSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryTutorId = searchParams.get('tutorId');

  const [tutors, setTutors] = useState([]);
  const [tutorId, setTutorId] = useState(queryTutorId || '');
  const [subjectId, setSubjectId] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/tutors').then(({ data }) => {
      const tutorList = Array.isArray(data) ? data : [];
      setTutors(tutorList);
      if (queryTutorId) {
        const found = tutorList.find((t) => String(t.id) === String(queryTutorId));
        if (found) {
          setTutorId(String(found.id));
          if (found.materias && found.materias.length === 1) {
            setSubjectId(String(found.materias[0].id));
          }
        }
      }
    }).catch(() => {
      setStatus({ type: 'error', message: 'No fue posible cargar la lista de tutores.' });
    });
  }, [queryTutorId]);

  const selectedTutor = tutors.find((tutor) => tutor.id === Number(tutorId));
  const materias = selectedTutor?.materias || [];

  const handleTutorChange = (event) => {
    const newId = event.target.value;
    setTutorId(newId);
    const tutorObj = tutors.find((t) => String(t.id) === String(newId));
    if (tutorObj?.materias?.length === 1) {
      setSubjectId(String(tutorObj.materias[0].id));
    } else {
      setSubjectId('');
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setSubmitting(true);
    try {
      const { data } = await api.post('/sessions', {
        tutor_id: Number(tutorId),
        subject_id: Number(subjectId),
        session_date: sessionDate,
        start_time: startTime,
        reason,
      });
      await Swal.fire({
        icon: 'success',
        title: '¡Sesión programada con éxito!',
        text: `${sessionDate} a las ${startTime} con ${selectedTutor?.nombre || ''} ${selectedTutor?.apellido || ''}. ${data?.message || ''}`,
        confirmButtonColor: '#167963',
      });
      navigate('/mis-sesiones');
    } catch (error) {
      const message = error.response?.data?.message || 'No fue posible programar la sesión.';
      await Swal.fire({ icon: 'error', title: 'No se pudo programar', text: message, confirmButtonColor: '#167963' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="single-panel">
      <section className="form-panel schedule-panel">
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

        <div className="form-heading">
          <p className="eyebrow">NUEVA SESIÓN</p>
          <h2>Programar sesión de tutoría</h2>
          <p>Elige un tutor, la materia y el horario que necesitas.</p>
        </div>

        <form onSubmit={submit} className="schedule-form">
          <label>
            <span>Tutor</span>
            <select value={tutorId} onChange={handleTutorChange} required>
              <option value="" disabled>Selecciona un tutor</option>
              {tutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.nombre} {tutor.apellido} — {tutor.especialidad}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Materia</span>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              disabled={!tutorId}
            >
              <option value="" disabled>
                {tutorId ? 'Selecciona una materia' : 'Primero selecciona un tutor'}
              </option>
              {materias.map((materia) => (
                <option key={materia.id} value={materia.id}>
                  {materia.nombre}
                </option>
              ))}
            </select>
          </label>

          <div className="time-grid">
            <label>
              <span>Fecha</span>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Hora de inicio</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </label>
          </div>

          <label>
            <span>Motivo de la sesión</span>
            <input
              type="text"
              value={reason}
              placeholder="Ej: Dudas sobre cálculo integral y ejercicios de examen"
              onChange={(e) => setReason(e.target.value)}
              minLength={5}
              required
            />
          </label>

          {status.message && <div className={`feedback ${status.type}`}>{status.message}</div>}

          <button className="submit-button" type="submit" disabled={submitting}>
            {submitting ? 'Programando…' : 'Programar sesión'}
          </button>
        </form>
      </section>
    </main>
  );
}
