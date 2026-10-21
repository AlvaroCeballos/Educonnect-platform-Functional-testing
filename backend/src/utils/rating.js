const MIN_RATING = 0;
const MAX_RATING = 5;

const validateRatingPayload = (payload = {}) => {
  const rawRating = payload.rating;
  const rating = typeof rawRating === 'number' ? rawRating : Number(rawRating);

  if (rawRating === undefined || rawRating === null || rawRating === ''
    || !Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) {
    return {
      valid: false,
      message: `La calificación debe ser un número entero entre ${MIN_RATING} y ${MAX_RATING}`,
    };
  }

  const comment = payload.comment == null ? null : String(payload.comment).trim();
  if (comment && comment.length > 1000) {
    return { valid: false, message: 'El comentario no puede superar los 1000 caracteres' };
  }

  return { valid: true, rating, comment: comment || null };
};

const canRateSession = (session, studentId) => Boolean(
  session
  && Number(session.studentId) === Number(studentId)
  && session.status === 'ATTENDED',
);

const canRateStudentSession = (session, tutorId) => Boolean(
  session
  && Number(session.tutorId) === Number(tutorId)
  && session.status === 'ATTENDED',
);

module.exports = {
  MIN_RATING,
  MAX_RATING,
  validateRatingPayload,
  canRateSession,
  canRateStudentSession,
};
