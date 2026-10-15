const pool = require('../config/db');
const { validateStudyPlanPayload, canAttendSession } = require('../utils/studyPlan');

const resolveTutorProfileId = (req) => Number(req.user?.tutorId || req.user?.id);

const createStudyPlan = async (req, res, next) => {
  const validation = validateStudyPlanPayload(req.body);
  if (!validation.valid) return res.status(400).json({ message: validation.message });

  const { sessionId, dificultadesDetectadas, recursos } = validation.plan;
  const tutorId = resolveTutorProfileId(req);
  if (!Number.isInteger(tutorId) || tutorId < 1) {
    return res.status(401).json({ message: 'La sesión no identifica al tutor' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [sessionRows] = await connection.execute(
      'SELECT id, tutor_id AS tutorId, status FROM sessions WHERE id = ? FOR UPDATE',
      [sessionId],
    );
    const session = sessionRows[0];
    if (!session) {
      await connection.rollback();
      return res.status(404).json({ message: 'La sesión no existe' });
    }
    if (session.tutorId !== tutorId) {
      await connection.rollback();
      return res.status(403).json({ message: 'No tienes permiso para atender esta sesión' });
    }
    if (!canAttendSession(session.status)) {
      await connection.rollback();
      return res.status(409).json({ message: `La sesión no está pendiente (estado actual: ${session.status})` });
    }

    const [planResult] = await connection.execute(
      'INSERT INTO study_plans (session_id, dificultades_detectadas) VALUES (?, ?)',
      [sessionId, dificultadesDetectadas],
    );
    const studyPlanId = planResult.insertId;

    const insertedRecursos = [];
    for (const recurso of recursos) {
      const [recursoResult] = await connection.execute(
        `INSERT INTO study_resources (study_plan_id, nombre_recurso, tipo_recurso, descripcion_uso)
         VALUES (?, ?, ?, ?)`,
        [studyPlanId, recurso.nombreRecurso, recurso.tipoRecurso, recurso.descripcionUso],
      );
      insertedRecursos.push({
        id: recursoResult.insertId,
        nombre_recurso: recurso.nombreRecurso,
        tipo_recurso: recurso.tipoRecurso,
        descripcion_uso: recurso.descripcionUso,
      });
    }

    await connection.execute(
      "UPDATE sessions SET status = 'ATTENDED' WHERE id = ?",
      [sessionId],
    );

    await connection.commit();

    return res.status(201).json({
      id: studyPlanId,
      session_id: sessionId,
      dificultades_detectadas: dificultadesDetectadas,
      recursos: insertedRecursos,
    });
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); } catch (_) { /* noop */ }
    }
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Esta sesión ya tiene un plan de estudio registrado' });
    }
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createStudyPlan,
};
