const pool = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');

const updateStudentProfile = async (req, res) => {
  const { nombre, apellido, carnet, newPassword } = req.body;
  const userId = req.user.id;
  const studentId = req.user.studentId;

  if (!nombre || !apellido || !carnet) {
    return res.status(400).json({ message: 'Nombre, apellido y carnet son obligatorios' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Actualizar perfil del estudiante
    const [updateResult] = await conn.execute(
      `UPDATE student_profiles SET nombre = ?, apellido = ?, carnet = ? WHERE id = ?`,
      [nombre, apellido, carnet, studentId]
    );

    if (updateResult.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Perfil de estudiante no encontrado' });
    }

    // Actualizar contraseña si se proporcionó
    if (newPassword) {
      const hashedPassword = await hashPassword(newPassword);
      await conn.execute(
        `UPDATE users SET password_hash = ? WHERE id = ?`,
        [hashedPassword, userId]
      );
    }

    await conn.commit();

    return res.status(200).json({
      message: 'Perfil actualizado correctamente',
      student: { id: studentId, nombre, apellido, carnet, email: req.user.email }
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('Error al actualizar perfil:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { updateStudentProfile };
