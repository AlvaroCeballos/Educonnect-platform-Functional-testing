import { useEffect, useState } from 'react';
import api from './utils/api';
import { validateSchedule, WEEK_DAYS } from './scheduleValidation';

export default function ScheduleForm() {
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/tutors/me/schedules').then(({ data }) => {
      const first = data.horarios?.[0];
      setDays((data.horarios || []).map((row) => String(row.dayOfWeek)));
      if (first) { setStartTime(first.startTime.slice(0, 5)); setEndTime(first.endTime.slice(0, 5)); }
    }).catch(() => {});
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const message = validateSchedule({ days, startTime, endTime });
    if (message) { setStatus({ type: 'error', message }); return; }
    setSubmitting(true); setStatus({ type: '', message: '' });
    try {
      const response = await api.post('/tutors/me/schedules', { days: days.map(Number), startTime, endTime });
      setStatus({ type: 'success', message: response.data.message });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'No fue posible guardar el horario.' });
    } finally { setSubmitting(false); }
  };

  return <main className="single-panel"><section className="form-panel schedule-panel">
    <div className="form-heading"><p className="eyebrow">DISPONIBILIDAD DEL TUTOR</p><h2>Establece tu horario</h2><p>El mismo rango se aplicará a todos los días seleccionados.</p></div>
    <form onSubmit={submit} className="schedule-form">
      <fieldset><legend>Días de atención</legend><div className="day-grid">{WEEK_DAYS.map(([value, label]) => <label key={value} className="day-option"><input type="checkbox" checked={days.includes(value)} onChange={() => setDays((current) => current.includes(value) ? current.filter((day) => day !== value) : [...current, value])} /><span>{label}</span></label>)}</div></fieldset>
      <div className="time-grid"><label><span>Hora de inicio</span><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></label><label><span>Hora de fin</span><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required /></label></div>
      {status.message && <div className={`feedback ${status.type}`}>{status.message}</div>}
      <button className="submit-button" type="submit" disabled={submitting}>{submitting ? 'Guardando…' : 'Guardar disponibilidad'}</button>
    </form>
  </section></main>;
}
