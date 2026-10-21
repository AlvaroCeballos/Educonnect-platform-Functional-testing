import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../utils/api';

const categories = {
  student: [
    'Ética y profesionalismo',
    'Negligencia académica',
    'Abuso y conducta inapropiada',
    'Falsificación de información',
    'Inasistencia o abandono de sesión',
  ],
  tutor: [
    'Conducta inapropiada',
    'Falsificación de documentos',
    'Agresión verbal o física',
    'Robo o daño a las instalaciones',
    'Falta de respeto o indisciplina',
  ],
};

export default function IncidentReportForm({ role, sessionId, onSubmitted }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reportedLabel = role === 'student' ? 'al tutor' : 'al estudiante';

  const submit = async (event) => {
    event.preventDefault();
    if (!category || reason.trim().length < 10) return;

    setSubmitting(true);
    try {
      const path = role === 'student'
        ? `/sessions/${sessionId}/report-tutor`
        : `/sessions/${sessionId}/report-student`;
      const { data } = await api.post(path, { category, reason: reason.trim() });
      onSubmitted?.(data.incident);
      setOpen(false);
      setCategory('');
      setReason('');
      await Swal.fire({
        icon: 'success',
        title: 'Reporte registrado',
        text: `El reporte contra ${reportedLabel} fue enviado para revisión.`,
        confirmButtonColor: '#167963',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo registrar el reporte',
        text: error.response?.data?.message || 'Intenta de nuevo.',
        confirmButtonColor: '#167963',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button type="button" className="incident-open-button" onClick={() => setOpen(true)}>
        Reportar {reportedLabel}
      </button>
    );
  }

  return (
    <form className="incident-report-form" onSubmit={submit}>
      <strong>Reporte disciplinario</strong>
      <label>
        Categoría
        <select value={category} onChange={(event) => setCategory(event.target.value)} required>
          <option value="">Selecciona una categoría</option>
          {categories[role].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>
        Motivo <span>(mínimo 10 caracteres)</span>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          minLength="10"
          maxLength="1000"
          required
          placeholder="Describe los hechos de la sesión."
        />
      </label>
      <div className="incident-form-actions">
        <button type="button" className="incident-cancel-button" onClick={() => setOpen(false)} disabled={submitting}>
          Cancelar
        </button>
        <button type="submit" className="incident-submit-button" disabled={submitting || !category || reason.trim().length < 10}>
          {submitting ? 'Enviando…' : 'Enviar reporte'}
        </button>
      </div>
    </form>
  );
}
