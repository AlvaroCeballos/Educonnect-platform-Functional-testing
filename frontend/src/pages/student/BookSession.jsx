import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../utils/api';

export default function BookSession() {
  const [tutors, setTutors] = useState([]);
  const [tutorId, setTutorId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/tutors').then(({ data }) => setTutors(data)).catch(() => {
      setStatus({ type: 'error', message: 'No fue posible cargar la lista de tutores.' });
    });
  }, []);

  const selectedTutor = tutors.find((tutor) => tutor.id === Number(tutorId));
  const materias = selectedTutor?.materias || [];

  const handleTutorChange = (event) => {
    setTutorId(event.target.value);
    setSubjectId('');
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
        title: 'Sesión programada',
        text: `${sessionDate} a las ${startTime} con ${selectedTutor?.nombre} ${selectedTutor?.apellido}. ${data.message}`,
        confirmButtonColor: '#167963',
      });
      setTutorId(''); setSubjectId(''); setSessionDate(''); setStartTime(''); setReason('');
    } catch (error) {
      const message = error.response?.data?.message || 'No fue posible programar la sesión.';
      await Swal.fire({ icon: 'error', title: 'No se pudo programar', text: message, confirmButtonColor: '#167963' });
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="single-panel"><section className="form-panel schedule-panel">
    <div className="form-heading"><p className="eyebrow">NUEVA SESIÓN</p><h2>Programar sesión de tutoría</h2><p>Elige un tutor, la materia y el horario que necesitas.</p></div>
    <form onSubmit={submit} className="schedule-form">
      <label><span>Tutor</span>
        <select value={tutorId} onChange={handleTutorChange} required>
          <option value="" disabled>Selecciona un tutor</option>
          {tutors.map((tutor) => <option key={tutor.id} value={tutor.id}>{tutor.nombre} {tutor.apellido} — {tutor.especialidad}</option>)}
        </select>
      </label>
      <label><span>Materia</span>
        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required disabled={!tutorId}>
          <option value="" disabled>Selecciona una materia</option>
          {materias.map((materia) => <option key={materia.id} value={materia.id}>{materia.nombre}</option>)}
        </select>
      </label>
      <div className="time-grid">
        <label><span>Fecha</span><input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} required /></label>
        <label><span>Hora de inicio</span><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></label>
      </div>
      <label><span>Motivo de la sesión</span><input type="text" value={reason} onChange={(e) => setReason(e.target.value)} minLength={5} required /></label>
      {status.message && <div className={`feedback ${status.type}`}>{status.message}</div>}
      <button className="submit-button" type="submit" disabled={submitting}>{submitting ? 'Programando…' : 'Programar sesión'}</button>
    </form>
  </section></main>;
}
