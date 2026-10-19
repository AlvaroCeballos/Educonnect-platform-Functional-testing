const pool = require('../config/db');
const {
  canReportSession,
  validateIncidentPayload,
} = require('../utils/incidentReport');
const { resolveStudentProfileId, resolveTutorProfileId } = require('./sessionController');

const resolveReporter = async (reporterRole, req) => {
  const profileId = reporterRole === 'student'
    ? await resolveStudentProfileId(req)
    : await resolveTutorProfileId(req);
  if (!profileId) return null;

  const table = reporterRole === 'student' ? 'student_profiles' : 'tutor_profiles';
  const [rows] = await pool.execute(`SELECT id, user_id AS userId FROM ${table} WHERE id = ?`, [profileId]);
  return rows[0] || null;
};

const createIncident = (reporterRole) => async (req, res, next) => {
  const sessionId = Number(req.params.sessionId);
  if (!Number.isInteger(sessionId) || sessionId < 1) {
    return res.status(400).json({ message: 'El identificador de la sesión no es válido' });
  }

  const validation = validateIncidentPayload(req.body, reporterRole);
  if (!validation.valid) return res.status(400).json({ message: validation.message });

  try {
    const reporter = await resolveReporter(reporterRole, req);
    if (!reporter) return res.status(401).json({ message: 'La sesión no identifica al participante' });

    const [sessionRows] = await pool.execute(
      `SELECT id, student_id AS studentId, tutor_id AS tutorId, status
         FROM sessions WHERE id = ?`,
      [sessionId],
    );
    const session = sessionRows[0];
    const profileId = reporterRole === 'student' ? session?.studentId : session?.tutorId;
    if (!session || !canReportSession(session, profileId)) {
      return res.status(409).json({ message: 'Solo puedes reportar una sesión atendida propia' });
    }

    const reportedTable = reporterRole === 'student' ? 'tutor_profiles' : 'student_profiles';
    const [reportedRows] = await pool.execute(
      `SELECT user_id AS userId FROM ${reportedTable} WHERE id = ?`,
      [reporterRole === 'student' ? session.tutorId : session.studentId],
    );
    const reportedUser = reportedRows[0];
    if (!reportedUser) return res.status(404).json({ message: 'Participante reportado no encontrado' });

    const [result] = await pool.execute(
      `INSERT INTO incident_reports
        (session_id, reporter_id, reported_user_id, reporter_role, category, reason)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sessionId, reporter.userId, reportedUser.userId, reporterRole, validation.category, validation.reason],
    );

    return res.status(201).json({
      message: 'Reporte disciplinario registrado correctamente',
      incident: {
        id: result.insertId,
        sessionId,
        reporterRole,
        category: validation.category,
        reason: validation.reason,
        status: 'PENDING',
      },
    });
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un reporte tuyo para esta sesión' });
    }
    return next(error);
  }
};

const getMyIncidents = (reporterRole) => async (req, res, next) => {
  try {
    const reporter = await resolveReporter(reporterRole, req);
    if (!reporter) return res.status(401).json({ message: 'La sesión no identifica al participante' });

    const [rows] = await pool.execute(
      `SELECT id, session_id AS sessionId, category, reason, status, created_at AS createdAt
         FROM incident_reports
        WHERE reporter_id = ? AND reporter_role = ?
        ORDER BY created_at DESC`,
      [reporter.userId, reporterRole],
    );
    return res.json({ incidents: rows });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createIncident, getMyIncidents };
