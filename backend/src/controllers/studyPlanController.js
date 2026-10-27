const pool = require('../config/db');
const { validateStudyPlanPayload, canAttendSession } = require('../utils/studyPlan');
const { generateCertificatePDF, validateCertificatePayload } = require('../utils/certificatePdf');

const { resolveTutorProfileId } = require('./sessionController');

const resolveStudentProfileId = async (req) => {
  if (req.user?.studentId) return Number(req.user.studentId);
  const [rows] = await pool.execute('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
  return rows[0]?.id ?? null;
};

const createStudyPlan = async (req, res, next) => {
  const validation = validateStudyPlanPayload(req.body);
  if (!validation.valid) return res.status(400).json({ message: validation.message });

  const { sessionId, dificultadesDetectadas, recursos } = validation.plan;
  const tutorId = await resolveTutorProfileId(req);
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

const fetchStudyPlanByIdForStudent = async (planId, studentId) => {
  const [planRows] = await pool.execute(
    `SELECT
       sp.id,
       sp.session_id,
       sess.session_date,
       CONCAT(tp.nombre, ' ', tp.apellido) AS tutor_name,
       tp.especialidad                     AS tutor_specialty,
       tp.identificacion                   AS tutor_identification,
       sp.dificultades_detectadas,
       sp.created_at
     FROM study_plans sp
     INNER JOIN sessions sess       ON sp.session_id = sess.id
     INNER JOIN tutor_profiles tp   ON sess.tutor_id = tp.id
     WHERE sp.id = ? AND sess.student_id = ?
     LIMIT 1`,
    [planId, studentId],
  );
  const plan = planRows[0];
  if (!plan) return null;

  const [recursoRows] = await pool.execute(
    `SELECT nombre_recurso, tipo_recurso, descripcion_uso
       FROM study_resources
      WHERE study_plan_id = ?
      ORDER BY id`,
    [plan.id],
  );

  return {
    id: plan.id,
    session_id: plan.session_id,
    session_date: plan.session_date,
    tutor_name: plan.tutor_name,
    tutor_specialty: plan.tutor_specialty,
    tutor_identification: plan.tutor_identification,
    dificultades_detectadas: plan.dificultades_detectadas,
    recursos: recursoRows.map((r) => ({
      nombre_recurso: r.nombre_recurso,
      tipo_recurso: r.tipo_recurso,
      descripcion_uso: r.descripcion_uso,
    })),
    created_at: plan.created_at,
  };
};

const getMyStudyPlans = async (req, res, next) => {
  try {
    const studentId = await resolveStudentProfileId(req);
    if (!studentId) return res.status(401).json({ message: 'La sesión no identifica al estudiante' });

    const [planRows] = await pool.execute(
      `SELECT
         sp.id,
         sp.session_id,
         sess.session_date,
         CONCAT(tp.nombre, ' ', tp.apellido) AS tutor_name,
         tp.especialidad                     AS tutor_specialty,
         tp.identificacion                   AS tutor_identification,
         sp.dificultades_detectadas,
         sp.created_at
       FROM study_plans sp
       INNER JOIN sessions sess       ON sp.session_id = sess.id
       INNER JOIN tutor_profiles tp   ON sess.tutor_id = tp.id
       WHERE sess.student_id = ?
       ORDER BY sp.created_at DESC`,
      [studentId],
    );

    if (planRows.length === 0) return res.json({ plans: [] });

    const planIds = planRows.map((p) => p.id);
    const [recursoRows] = await pool.query(
      `SELECT study_plan_id, nombre_recurso, tipo_recurso, descripcion_uso
         FROM study_resources
        WHERE study_plan_id IN (?)
        ORDER BY study_plan_id, id`,
      [planIds],
    );

    const recursosPorPlan = recursoRows.reduce((acc, r) => {
      const list = acc.get(r.study_plan_id) || [];
      list.push({
        nombre_recurso: r.nombre_recurso,
        tipo_recurso: r.tipo_recurso,
        descripcion_uso: r.descripcion_uso,
      });
      acc.set(r.study_plan_id, list);
      return acc;
    }, new Map());

    const plans = planRows.map((p) => ({
      id: p.id,
      session_id: p.session_id,
      session_date: p.session_date,
      tutor_name: p.tutor_name,
      tutor_specialty: p.tutor_specialty,
      tutor_identification: p.tutor_identification,
      dificultades_detectadas: p.dificultades_detectadas,
      recursos: recursosPorPlan.get(p.id) || [],
      created_at: p.created_at,
    }));

    return res.json({ plans });
  } catch (error) {
    return next(error);
  }
};

const downloadCertificate = async (req, res, next) => {
  try {
    const studentId = await resolveStudentProfileId(req);
    if (!studentId) return res.status(401).json({ message: 'La sesión no identifica al estudiante' });

    const planId = Number(req.params.planId);
    if (!Number.isInteger(planId) || planId < 1) {
      return res.status(400).json({ message: 'El identificador del plan debe ser un entero positivo' });
    }

    const plan = await fetchStudyPlanByIdForStudent(planId, studentId);
    if (!plan) {
      return res.status(404).json({ message: 'El plan de estudio no existe o no te pertenece' });
    }

    const validation = validateCertificatePayload(plan);
    if (!validation.valid) {
      return res.status(500).json({ message: `No se puede generar la constancia: ${validation.message}` });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="constancia-sesion-${plan.session_id}.pdf"`);

    generateCertificatePDF(plan, res);
  } catch (error) {
    if (res.headersSent) return;
    return next(error);
  }
};

module.exports = {
  createStudyPlan,
  getMyStudyPlans,
  fetchStudyPlanByIdForStudent,
  downloadCertificate,
};
