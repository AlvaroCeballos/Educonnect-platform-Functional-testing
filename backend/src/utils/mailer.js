const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io';
  const port = Number(process.env.SMTP_PORT) || 2525;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || user === 'tu_mailtrap_user') {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });
};

/**
 * Envía correo de notificación de decisión de cuenta (HU-004 / HU-005)
 * @param {Object} params
 * @param {string} params.to - Correo del destinatario
 * @param {string} params.nombre - Nombre del usuario
 * @param {string} params.role - 'student' o 'tutor'
 * @param {string} params.status - 'APPROVED' o 'REJECTED'
 * @param {string} [params.reason] - Motivo opcional
 */
const sendAccountDecisionEmail = async ({ to, nombre, role, status, reason = '' }) => {
  const roleLabel = role === 'tutor' ? 'Tutor' : 'Estudiante';
  const isApproved = status === 'APPROVED';
  const from = process.env.SMTP_FROM || 'noreply@educonnect.local';

  const subject = isApproved
    ? `¡Tu cuenta de ${roleLabel} ha sido aprobada! — EduConnect`
    : `Actualización sobre tu solicitud de ${roleLabel} — EduConnect`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f6f8; color: #1e293b; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background-color: #0f766e; padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .badge-role { display: inline-block; background-color: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 8px; }
        .content { padding: 32px 28px; line-height: 1.6; }
        .status-box { padding: 18px 20px; border-radius: 12px; margin: 24px 0; font-size: 15px; font-weight: 500; }
        .status-box.approved { background-color: #ecfdf5; border-left: 5px solid #10b981; color: #065f46; }
        .status-box.rejected { background-color: #fef2f2; border-left: 5px solid #ef4444; color: #991b1b; }
        .button-wrap { text-align: center; margin: 30px 0 20px; }
        .btn { display: inline-block; background-color: #0f766e; color: #ffffff !important; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EduConnect</h1>
          <div class="badge-role">Plataforma de Tutorías Académicas</div>
        </div>
        <div class="content">
          <p>Hola <strong>${nombre || 'Usuario'}</strong>,</p>
          <p>Te informamos que la administración ha revisado tu solicitud de registro como <strong>${roleLabel}</strong>.</p>
          
          <div class="status-box ${isApproved ? 'approved' : 'rejected'}">
            ${isApproved
              ? '<strong>¡Felicidades!</strong> Tu cuenta ha sido <strong>APROBADA</strong> exitosamente. Ya puedes iniciar sesión y acceder a todas las funcionalidades del sistema.'
              : `<strong>Estado de la solicitud: RECHAZADA</strong>.<br>Lamentablemente tu solicitud no ha sido aceptada en esta ocasión.${reason ? `<br><br><strong>Motivo:</strong> ${reason}` : ''}`}
          </div>

          ${isApproved ? `
            <div class="button-wrap">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="btn">Iniciar Sesión</a>
            </div>
          ` : `
            <p style="font-size: 13px; color: #64748b;">Si consideras que se trata de un error o deseas volver a postularte con datos corregidos, puedes ponerte en contacto con la administración.</p>
          `}
        </div>
        <div class="footer">
          Este es un correo automático generado por EduConnect. Por favor no respondas a este mensaje.
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[SIMULACIÓN CORREO] Para: ${to} | Asunto: ${subject} | Estado: ${status} (Configure SMTP_USER y SMTP_PASS en .env para envío real por Mailtrap)`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"EduConnect Administración" <${from}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`[CORREO ENVIADO] ID: ${info.messageId} | Para: ${to} | Asunto: ${subject}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[ERROR CORREO] Fallo al enviar a ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendAccountDecisionEmail,
};
