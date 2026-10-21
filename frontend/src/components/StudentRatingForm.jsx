import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../utils/api';

export default function StudentRatingForm({ sessionId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post(`/ratings/tutor/sessions/${sessionId}`, {
        rating,
        comment: comment.trim() || null,
      });
      onSubmitted?.(data.rating);
      await Swal.fire({ icon: 'success', title: 'Calificación registrada', confirmButtonColor: '#167963' });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo registrar la calificación',
        text: error.response?.data?.message || 'Intenta de nuevo.',
        confirmButtonColor: '#167963',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="rating-panel tutor-rating-panel" onSubmit={submit}>
      <strong>Califica al estudiante</strong>
      <div className="star-rating" aria-label="Selecciona una calificación de 0 a 5 estrellas">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star-button${rating >= star ? ' selected' : ''}`}
            type="button"
            aria-label={`${star} estrellas`}
            aria-pressed={rating === star}
            onClick={() => setRating(star)}
          >
            {rating >= star ? '★' : '☆'}
          </button>
        ))}
        <button type="button" className={`zero-rating${rating === 0 ? ' selected' : ''}`} onClick={() => setRating(0)}>
          0 estrellas
        </button>
      </div>
      <textarea
        className="rating-comment"
        maxLength="1000"
        placeholder="Comentario opcional"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <button className="submit-button rating-submit" type="submit" disabled={submitting}>
        {submitting ? 'Guardando…' : 'Enviar calificación'}
      </button>
    </form>
  );
}
