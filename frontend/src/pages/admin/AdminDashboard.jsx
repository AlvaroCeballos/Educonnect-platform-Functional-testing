import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'tutors'
  const [studentView, setStudentView] = useState('pending'); // 'pending' | 'approved'
  const [tutorView, setTutorView] = useState('pending'); // 'pending' | 'approved'
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [tutorSearchTerm, setTutorSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        api.get('/admin/users', { params: { status: 'PENDING' } }),
        api.get('/admin/users', { params: { status: 'APPROVED' } }),
      ]);
      setPendingUsers(pendingRes.data.users || []);
      setApprovedUsers(approvedRes.data.users || []);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  }, []);

  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/auth/admin/profile');
        setAdmin(response.data.user);
        await loadUsers();
      } catch (err) {
        console.error('Acceso denegado:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [loadUsers, navigate]);

  const handleApprove = async (user) => {
    const isTutor = user.role === 'tutor';
    const roleLabel = isTutor ? 'tutor' : 'estudiante';
    const nombre = [user.nombre, user.apellido].filter(Boolean).join(' ') || 'el usuario';

    const confirm = await Swal.fire({
      icon: 'question',
      title: `¿Aprobar ${roleLabel}?`,
      html: isTutor ? `
        <div style="text-align: left; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; margin: 12px 0; font-size: 13px; color: #334155;">
          <p style="margin: 0 0 6px;"><strong>Tutor:</strong> ${nombre}</p>
          <p style="margin: 0 0 6px;"><strong>Especialidad:</strong> ${user.especialidad || 'General'}</p>
          <p style="margin: 0 0 6px;"><strong>Universidad:</strong> ${user.universidad || '—'}</p>
          <p style="margin: 0;"><strong>Correo:</strong> ${user.email}</p>
        </div>
        ¿Confirmas la habilitación de este tutor?<br>
        <span style="font-size: 13px; color: #64748b;">Podrá iniciar sesión, gestionar horarios y se enviará la notificación por correo.</span>
      ` : `¿Estás seguro de que deseas aprobar la cuenta de <strong>${nombre}</strong>?<br><br><span style="font-size: 13px; color: #64748b;">Se habilitará el acceso y se enviará un correo automático a <strong>${user.email}</strong>.</span>`,
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#167963',
      cancelButtonColor: '#64748b',
    });

    if (!confirm.isConfirmed) return;

    setActionId(user.id);
    try {
      const res = await api.patch(`/admin/users/${user.id}/status`, { status: 'APPROVED' });
      await Swal.fire({
        icon: 'success',
        title: '¡Solicitud aprobada!',
        text: res.data.message || `La cuenta ha sido aprobada y se notificó al usuario.`,
        confirmButtonColor: '#167963',
      });
      await loadUsers();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al aprobar',
        text: err.response?.data?.message || 'No fue posible actualizar la solicitud.',
        confirmButtonColor: '#167963',
      });
    } finally {
      setActionId(null);
    }
  };

  const resolveMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://localhost:5000${url}`;
  };

  const handleViewTutorDetails = (tutor) => {
    const currentYear = new Date().getFullYear();
    const expYears = tutor.anio_inicio_experiencia ? currentYear - Number(tutor.anio_inicio_experiencia) : null;
    const nombre = [tutor.nombre, tutor.apellido].filter(Boolean).join(' ') || 'Sin nombre';
    const photoUrl = resolveMediaUrl(tutor.fotografia_url);

    Swal.fire({
      title: `<span style="font-size: 20px; font-weight: 800; color: #102c46;">Dossier del Tutor</span>`,
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin: 12px 0;">
          ${photoUrl ? `
            <img src="${photoUrl}" alt="${nombre}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid #167963; box-shadow: 0 4px 12px rgba(0,0,0,0.12);" onerror="this.style.display='none'" />
          ` : `
            <div style="width: 90px; height: 90px; border-radius: 50%; background: #167963; color: white; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold;">
              ${(tutor.nombre?.[0] || 'T').toUpperCase()}
            </div>
          `}
          <h3 style="margin: 0; font-size: 18px; color: #0f172a;">${nombre}</h3>
          <span style="font-size: 13px; color: #64748b;">${tutor.email}</span>
        </div>
        <div style="text-align: left; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 13px; line-height: 1.8; color: #334155;">
          <div><strong>Carnet:</strong> ${tutor.carnet || '—'}</div>
          <div><strong>DPI / Identificación:</strong> ${tutor.identificacion || '—'}</div>
          <div><strong>Especialidad:</strong> <span style="background: #eaf9f4; color: #14735e; padding: 2px 8px; border-radius: 6px; font-weight: 700;">${tutor.especialidad || '—'}</span></div>
          <div><strong>Universidad:</strong> ${tutor.universidad || '—'}</div>
          <div><strong>Experiencia:</strong> Desde ${tutor.anio_inicio_experiencia || '—'} ${expYears !== null ? `(${expYears} años)` : ''}</div>
          <div><strong>Modalidad / Dirección:</strong> ${tutor.direccion_tutoria || '—'}</div>
          <div><strong>Género:</strong> ${formatGender(tutor.genero)}</div>
          <div><strong>Fecha de Nacimiento:</strong> ${formatDate(tutor.fecha_nacimiento)}</div>
          <div><strong>Fecha de Solicitud:</strong> ${formatDate(tutor.created_at)}</div>
          <div><strong>Estado actual:</strong> <span style="font-weight:700; color:${tutor.status === 'APPROVED' ? '#167963' : '#b45309'};">${tutor.status === 'APPROVED' ? 'Aprobado / Activo' : 'Pendiente'}</span></div>
        </div>
      `,
      showCancelButton: true,
      showConfirmButton: tutor.status !== 'APPROVED',
      showDenyButton: tutor.status !== 'APPROVED',
      confirmButtonText: 'Aceptar Tutor',
      denyButtonText: 'Rechazar Tutor',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#167963',
      denyButtonColor: '#a42e3a',
      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (tutor.status !== 'APPROVED') {
        if (result.isConfirmed) {
          handleApprove(tutor);
        } else if (result.isDenied) {
          handleReject(tutor);
        }
      }
    });
  };


  const handleReject = async (user) => {
    const roleLabel = user.role === 'tutor' ? 'tutor' : 'estudiante';
    const nombre = [user.nombre, user.apellido].filter(Boolean).join(' ') || 'el usuario';

    const { value: reason, isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: `¿Rechazar ${roleLabel}?`,
      html: `Indica el motivo del rechazo para <strong>${nombre}</strong> (se incluirá en el correo):`,
      input: 'textarea',
      inputPlaceholder: 'Ej: Datos ilegibles, carnet no coincide con registros...',
      showCancelButton: true,
      confirmButtonText: 'Confirmar rechazo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#a42e3a',
      cancelButtonColor: '#64748b',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'Debes ingresar un motivo de rechazo';
        }
      },
    });

    if (!isConfirmed) return;

    setActionId(user.id);
    try {
      const res = await api.patch(`/admin/users/${user.id}/status`, {
        status: 'REJECTED',
        reason: reason.trim(),
      });
      await Swal.fire({
        icon: 'info',
        title: 'Solicitud rechazada',
        text: res.data.message || `La solicitud ha sido rechazada y se notificó al usuario.`,
        confirmButtonColor: '#167963',
      });
      await loadUsers();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al rechazar',
        text: err.response?.data?.message || 'No fue posible actualizar la solicitud.',
        confirmButtonColor: '#167963',
      });
    } finally {
      setActionId(null);
    }
  };

  const handleDisableStudent = async (student) => {
    const nombre = [student.nombre, student.apellido].filter(Boolean).join(' ') || 'el estudiante';

    const confirm = await Swal.fire({
      icon: 'warning',
      title: '¿Dar de baja al estudiante?',
      html: `
        ¿Estás seguro de que deseas dar de baja a <strong>${nombre}</strong>?<br>
        <span style="font-size: 13px; color: #64748b;">Carnet: ${student.carnet || '—'} · Correo: ${student.email}</span><br><br>
        <span style="font-size: 13px; color: #a42e3a; font-weight: 600;">
          ⚠️ Esta acción es una baja lógica: el estudiante no podrá volver a iniciar sesión en la plataforma.
        </span>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#a42e3a',
      cancelButtonColor: '#64748b',
    });

    if (!confirm.isConfirmed) return;

    setActionId(student.id);
    try {
      const res = await api.patch(`/admin/users/${student.id}/disable`);
      await Swal.fire({
        icon: 'success',
        title: 'Estudiante dado de baja',
        text: res.data.message || 'La cuenta del estudiante ha sido desactivada.',
        confirmButtonColor: '#167963',
      });
      await loadUsers();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al dar de baja',
        text: err.response?.data?.message || 'No fue posible dar de baja al estudiante.',
        confirmButtonColor: '#167963',
      });
    } finally {
      setActionId(null);
    }
  };

  const handleDisableTutor = async (tutor) => {
    const nombre = [tutor.nombre, tutor.apellido].filter(Boolean).join(' ') || 'el tutor';

    const { value: reason, isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Dar de baja al tutor?',
      html: `
        ¿Estás seguro de que deseas dar de baja a <strong>${nombre}</strong>?<br>
        <span style="font-size: 13px; color: #64748b;">Especialidad: ${tutor.especialidad || 'General'} · Correo: ${tutor.email}</span><br><br>
        <span style="font-size: 13px; color: #a42e3a; font-weight: 600;">
          ⚠️ Esta acción es una baja lógica: el tutor no podrá iniciar sesión, no aparecerá en el catálogo de estudiantes y se enviará una notificación por correo a <strong>${tutor.email}</strong>.
        </span><br><br>
        <label style="display:block; text-align:left; font-size:12px; font-weight:600; color:#475569; margin-bottom:4px;">Motivo de la baja (opcional, para el correo):</label>
      `,
      input: 'textarea',
      inputPlaceholder: 'Ej: Inactividad prolongada, solicitud voluntaria o incumplimiento de normativas...',
      showCancelButton: true,
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#a42e3a',
      cancelButtonColor: '#64748b',
    });

    if (!isConfirmed) return;

    setActionId(tutor.id);
    try {
      const res = await api.patch(`/admin/users/${tutor.id}/disable`, { reason: reason || '' });
      await Swal.fire({
        icon: 'success',
        title: 'Tutor dado de baja',
        text: res.data.message || 'La cuenta del tutor ha sido desactivada y se notificó por correo.',
        confirmButtonColor: '#167963',
      });
      await loadUsers();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al dar de baja',
        text: err.response?.data?.message || 'No fue posible dar de baja al tutor.',
        confirmButtonColor: '#167963',
      });
    } finally {
      setActionId(null);
    }
  };

  const pendingStudents = pendingUsers.filter((u) => u.role === 'student');
  const approvedStudents = approvedUsers.filter((u) => u.role === 'student');
  const pendingTutors = pendingUsers.filter((u) => u.role === 'tutor');
  const approvedTutors = approvedUsers.filter((u) => u.role === 'tutor');

  const filteredApprovedStudents = approvedStudents.filter((u) => {
    if (!studentSearchTerm.trim()) return true;
    const term = studentSearchTerm.toLowerCase();
    const fullName = `${u.nombre || ''} ${u.apellido || ''}`.toLowerCase();
    const carnet = String(u.carnet || '').toLowerCase();
    const email = String(u.email || '').toLowerCase();
    return fullName.includes(term) || carnet.includes(term) || email.includes(term);
  });

  const filteredApprovedTutors = approvedTutors.filter((u) => {
    if (!tutorSearchTerm.trim()) return true;
    const term = tutorSearchTerm.toLowerCase();
    const fullName = `${u.nombre || ''} ${u.apellido || ''}`.toLowerCase();
    const carnet = String(u.carnet || '').toLowerCase();
    const email = String(u.email || '').toLowerCase();
    const especialidad = String(u.especialidad || '').toLowerCase();
    const universidad = String(u.universidad || '').toLowerCase();
    const identificacion = String(u.identificacion || '').toLowerCase();
    return (
      fullName.includes(term) ||
      carnet.includes(term) ||
      email.includes(term) ||
      especialidad.includes(term) ||
      universidad.includes(term) ||
      identificacion.includes(term)
    );
  });

  const formatGender = (gender) => {
    if (gender === 'M') return 'Masculino';
    if (gender === 'F') return 'Femenino';
    if (gender === 'OTHER') return 'Otro';
    return 'No especificado';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr.slice(0, 10);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center font-bold text-teal-800">Cargando solicitudes...</div>;
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">EDUCONNECT · ADMINISTRACIÓN</p>
          <h1>Panel Administrativo</h1>
          <p>Bienvenido, {admin?.email}</p>
        </div>
        <button
          className="admin-logout"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            navigate('/login');
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <main className="admin-content">
        <section className="admin-section-heading">
          <div>
            <p className="eyebrow">CONTROL DE ACCESO Y ADMINISTRACIÓN</p>
            <h2>Gestión de Usuarios y Solicitudes</h2>
            <p>Supervisa las solicitudes de ingreso y administra los usuarios activos en la plataforma.</p>
          </div>
          <span className="admin-count">
            {pendingStudents.length + pendingTutors.length} solicitudes pendientes
          </span>
        </section>

        {/* Pestañas para separar Estudiantes y Tutores */}
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Estudiantes
            <span className="admin-tab-count">{pendingStudents.length + approvedStudents.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'tutors' ? 'active' : ''}`}
            onClick={() => setActiveTab('tutors')}
          >
            Tutores
            <span className="admin-tab-count">{pendingTutors.length + approvedTutors.length}</span>
          </button>
        </div>

        {/* TAB 1: MÓDULO DE ESTUDIANTES (HU-004 y HU-024) */}
        {activeTab === 'students' && (
          <div>
            {/* Subpestañas para separar Pendientes y Aprobados */}
            <div className="admin-subtabs">
              <button
                type="button"
                className={`admin-subtab ${studentView === 'pending' ? 'active' : ''}`}
                onClick={() => setStudentView('pending')}
              >
                Solicitudes Pendientes (HU-004)
                <span className="badge-sub">{pendingStudents.length}</span>
              </button>
              <button
                type="button"
                className={`admin-subtab ${studentView === 'approved' ? 'active' : ''}`}
                onClick={() => setStudentView('approved')}
              >
                Estudiantes Aprobados / Activos (HU-024)
                <span className="badge-sub">{approvedStudents.length}</span>
              </button>
            </div>

            {/* Vista 1.1: Solicitudes Pendientes (HU-004) */}
            {studentView === 'pending' && (
              <section className="admin-table-card">
                <div className="admin-tab-header">
                  <h3>Solicitudes de Registro de Estudiantes (HU-004)</h3>
                  <p>Valida la información académica y decide la admisión a la plataforma.</p>
                </div>

                {pendingStudents.length === 0 ? (
                  <div className="admin-empty">No hay solicitudes de estudiantes pendientes de aprobación.</div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Estudiante</th>
                          <th>Carnet</th>
                          <th>Género</th>
                          <th>Fecha Nacimiento</th>
                          <th>Fecha Solicitud</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingStudents.map((student) => (
                          <tr key={student.id}>
                            <td>
                              <div className="admin-user-info">
                                {student.fotografia_url ? (
                                  <img
                                    src={resolveMediaUrl(student.fotografia_url)}
                                    alt="Foto Estudiante"
                                    className="admin-user-avatar"
                                  />
                                ) : (
                                  <div className="admin-avatar-placeholder" title="Fotografía por defecto">
                                    {(student.nombre?.[0] || 'E').toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <strong>
                                    {[student.nombre, student.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                                  </strong>
                                  <span>{student.email}</span>
                                  {student.universidad && (
                                    <span style={{ fontSize: '11px', color: '#0f766e' }}>{student.universidad}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="font-mono font-bold text-slate-700">{student.carnet || '—'}</span>
                            </td>
                            <td>
                              <span className="badge-gender">{formatGender(student.genero)}</span>
                            </td>
                            <td>{formatDate(student.fecha_nacimiento)}</td>
                            <td>{formatDate(student.created_at)}</td>
                            <td>
                              <div className="admin-actions">
                                <button
                                  type="button"
                                  className="approve-button"
                                  disabled={actionId === student.id}
                                  onClick={() => handleApprove(student)}
                                >
                                  {actionId === student.id ? '...' : 'Aceptar'}
                                </button>
                                <button
                                  type="button"
                                  className="reject-button"
                                  disabled={actionId === student.id}
                                  onClick={() => handleReject(student)}
                                >
                                  {actionId === student.id ? '...' : 'Rechazar'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* Vista 1.2: Estudiantes Aprobados / Activos (HU-024) */}
            {studentView === 'approved' && (
              <section className="admin-table-card">
                <div className="admin-tab-header">
                  <h3>Administración de Estudiantes Aprobados (HU-024)</h3>
                  <p>Consulta a los estudiantes activos. Puedes dar de baja a una cuenta para revocar su acceso.</p>
                </div>

                {/* Barra de búsqueda por Carnet, Nombre o Correo */}
                <div className="admin-search-bar">
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="🔍 Buscar por carnet, nombre o correo..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                  />
                  {studentSearchTerm && (
                    <button
                      type="button"
                      className="admin-clear-search"
                      onClick={() => setStudentSearchTerm('')}
                    >
                      Limpiar
                    </button>
                  )}
                  <span style={{ fontSize: '13px', color: '#64748b', marginLeft: 'auto' }}>
                    {filteredApprovedStudents.length} de {approvedStudents.length} estudiantes
                  </span>
                </div>

                {approvedStudents.length === 0 ? (
                  <div className="admin-empty">Aún no hay estudiantes en estado aprobado.</div>
                ) : filteredApprovedStudents.length === 0 ? (
                  <div className="admin-empty">No se encontraron estudiantes que coincidan con la búsqueda.</div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Estudiante</th>
                          <th>Carnet</th>
                          <th>Universidad / Carrera</th>
                          <th>Género</th>
                          <th>Estado</th>
                          <th>Fecha Registro</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApprovedStudents.map((student) => (
                          <tr key={student.id}>
                            <td>
                              <div className="admin-user-info">
                                {student.fotografia_url ? (
                                  <img
                                    src={resolveMediaUrl(student.fotografia_url)}
                                    alt="Foto Estudiante"
                                    className="admin-user-avatar"
                                  />
                                ) : (
                                  <div className="admin-avatar-placeholder" title="Fotografía por defecto">
                                    {(student.nombre?.[0] || 'E').toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <strong>
                                    {[student.nombre, student.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                                  </strong>
                                  <span>{student.email}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="font-mono font-bold text-slate-800" style={{ fontSize: '14px' }}>
                                {student.carnet || '—'}
                              </span>
                            </td>
                            <td>
                              <strong style={{ fontSize: '13px', color: '#0f766e' }}>
                                {student.universidad || 'USAC'}
                              </strong>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                {student.carrera || 'Ingeniería en Sistemas'}
                              </span>
                            </td>
                            <td>
                              <span className="badge-gender">{formatGender(student.genero)}</span>
                            </td>
                            <td>
                              <span className="badge-status-active">ACTIVO</span>
                            </td>
                            <td>{formatDate(student.created_at)}</td>
                            <td>
                              <button
                                type="button"
                                className="disable-button"
                                disabled={actionId === student.id}
                                title="Dar de baja lógica a este estudiante"
                                onClick={() => handleDisableStudent(student)}
                              >
                                {actionId === student.id ? 'Procesando...' : 'Dar de baja'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* TAB 2: MÓDULO DE TUTORES (HU-005 y HU-025) */}
        {activeTab === 'tutors' && (
          <div>
            {/* Subpestañas para separar Pendientes y Aprobados */}
            <div className="admin-subtabs">
              <button
                type="button"
                className={`admin-subtab ${tutorView === 'pending' ? 'active' : ''}`}
                onClick={() => setTutorView('pending')}
              >
                Solicitudes Pendientes (HU-005)
                <span className="badge-sub">{pendingTutors.length}</span>
              </button>
              <button
                type="button"
                className={`admin-subtab ${tutorView === 'approved' ? 'active' : ''}`}
                onClick={() => setTutorView('approved')}
              >
                Tutores Aprobados / Activos (HU-025)
                <span className="badge-sub">{approvedTutors.length}</span>
              </button>
            </div>

            {/* Vista 2.1: Solicitudes Pendientes (HU-005) */}
            {tutorView === 'pending' && (
              <section className="admin-table-card">
                <div className="admin-tab-header">
                  <h3>Solicitudes de Registro de Tutores (HU-005)</h3>
                  <p>Revisa la fotografía obligatoria, especialidad y credenciales profesionales del tutor.</p>
                </div>

                {pendingTutors.length === 0 ? (
                  <div className="admin-empty">No hay solicitudes de tutores pendientes de aprobación.</div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Tutor</th>
                          <th>Carnet / Identificación</th>
                          <th>Especialidad / Exp.</th>
                          <th>Universidad / Modalidad</th>
                          <th>Fecha Solicitud</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingTutors.map((tutor) => (
                          <tr key={tutor.id}>
                            <td>
                              <div className="admin-user-info">
                                <div
                                  className="admin-avatar-wrapper"
                                  onClick={() => handleViewTutorDetails(tutor)}
                                  title="Ver expediente del tutor"
                                >
                                  {tutor.fotografia_url ? (
                                    <img
                                      src={resolveMediaUrl(tutor.fotografia_url)}
                                      alt="Foto Tutor"
                                      className="admin-user-avatar tutor-avatar"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="admin-avatar-placeholder tutor"
                                    style={{ display: tutor.fotografia_url ? 'none' : 'flex' }}
                                  >
                                    {(tutor.nombre?.[0] || 'T').toUpperCase()}
                                  </div>
                                </div>
                                <div>
                                  <strong>
                                    {[tutor.nombre, tutor.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                                  </strong>
                                  <span>{tutor.email}</span>
                                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                                    {formatGender(tutor.genero)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>Carnet: {tutor.carnet || '—'}</strong>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>
                                  DPI: {tutor.identificacion || '—'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge-specialty">{tutor.especialidad || 'General'}</span>
                              {tutor.anio_inicio_experiencia && (
                                <span style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                                  Desde {tutor.anio_inicio_experiencia} ({new Date().getFullYear() - Number(tutor.anio_inicio_experiencia)} años exp.)
                                </span>
                              )}
                            </td>
                            <td>
                              <strong style={{ fontSize: '13px', color: '#0f766e' }}>{tutor.universidad || '—'}</strong>
                              <span style={{ fontSize: '12px', color: '#334155' }}>
                                {tutor.direccion_tutoria || 'Online'}
                              </span>
                            </td>
                            <td>{formatDate(tutor.created_at)}</td>
                            <td>
                              <div className="admin-actions">
                                <button
                                  type="button"
                                  className="detail-button"
                                  title="Ver expediente completo"
                                  onClick={() => handleViewTutorDetails(tutor)}
                                >
                                  Detalle
                                </button>
                                <button
                                  type="button"
                                  className="approve-button"
                                  disabled={actionId === tutor.id}
                                  onClick={() => handleApprove(tutor)}
                                >
                                  {actionId === tutor.id ? '...' : 'Aceptar'}
                                </button>
                                <button
                                  type="button"
                                  className="reject-button"
                                  disabled={actionId === tutor.id}
                                  onClick={() => handleReject(tutor)}
                                >
                                  {actionId === tutor.id ? '...' : 'Rechazar'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* Vista 2.2: Tutores Aprobados / Activos (HU-025) */}
            {tutorView === 'approved' && (
              <section className="admin-table-card">
                <div className="admin-tab-header">
                  <h3>Administración de Tutores Aprobados (HU-025)</h3>
                  <p>Consulta los tutores acreditados en el sistema y gestiona la baja lógica con notificación por correo.</p>
                </div>

                {/* Barra de búsqueda para tutores */}
                <div className="admin-search-bar">
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="🔍 Buscar por nombre, carnet, especialidad o correo..."
                    value={tutorSearchTerm}
                    onChange={(e) => setTutorSearchTerm(e.target.value)}
                  />
                  {tutorSearchTerm && (
                    <button
                      type="button"
                      className="admin-clear-search"
                      onClick={() => setTutorSearchTerm('')}
                    >
                      Limpiar
                    </button>
                  )}
                  <span style={{ fontSize: '13px', color: '#64748b', marginLeft: 'auto' }}>
                    Mostrando <strong>{filteredApprovedTutors.length}</strong> de {approvedTutors.length} tutores
                  </span>
                </div>

                {approvedTutors.length === 0 ? (
                  <div className="admin-empty">Aún no hay tutores en estado aprobado.</div>
                ) : filteredApprovedTutors.length === 0 ? (
                  <div className="admin-empty">
                    No se encontraron tutores que coincidan con "{tutorSearchTerm}".
                  </div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Tutor</th>
                          <th>Carnet / DPI</th>
                          <th>Especialidad / Exp.</th>
                          <th>Universidad / Modalidad</th>
                          <th>Estado</th>
                          <th>Fecha Registro</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApprovedTutors.map((tutor) => (
                          <tr key={tutor.id}>
                            <td>
                              <div className="admin-user-info">
                                <div
                                  className="admin-avatar-wrapper"
                                  onClick={() => handleViewTutorDetails(tutor)}
                                  title="Ver expediente del tutor"
                                >
                                  {tutor.fotografia_url ? (
                                    <img
                                      src={resolveMediaUrl(tutor.fotografia_url)}
                                      alt="Foto Tutor"
                                      className="admin-user-avatar tutor-avatar"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="admin-avatar-placeholder tutor"
                                    style={{ display: tutor.fotografia_url ? 'none' : 'flex' }}
                                  >
                                    {(tutor.nombre?.[0] || 'T').toUpperCase()}
                                  </div>
                                </div>
                                <div>
                                  <strong>
                                    {[tutor.nombre, tutor.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                                  </strong>
                                  <span>{tutor.email}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <span className="font-mono font-bold text-slate-800" style={{ fontSize: '14px' }}>
                                  {tutor.carnet || '—'}
                                </span>
                                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                                  DPI: {tutor.identificacion || '—'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge-specialty">{tutor.especialidad || 'General'}</span>
                              {tutor.anio_inicio_experiencia && (
                                <span style={{ fontSize: '11px', color: '#475569', display: 'block', marginTop: '3px' }}>
                                  Desde {tutor.anio_inicio_experiencia} ({new Date().getFullYear() - Number(tutor.anio_inicio_experiencia)} años exp.)
                                </span>
                              )}
                            </td>
                            <td>
                              <strong style={{ fontSize: '13px', color: '#0f766e' }}>{tutor.universidad || '—'}</strong>
                              <span style={{ fontSize: '12px', color: '#334155', display: 'block' }}>
                                {tutor.direccion_tutoria || 'Online'}
                              </span>
                            </td>
                            <td>
                              <span className="badge-status-active">ACTIVO</span>
                            </td>
                            <td>{formatDate(tutor.created_at)}</td>
                            <td>
                              <div className="admin-actions">
                                <button
                                  type="button"
                                  className="detail-button"
                                  title="Ver expediente completo"
                                  onClick={() => handleViewTutorDetails(tutor)}
                                >
                                  Detalle
                                </button>
                                <button
                                  type="button"
                                  className="disable-button"
                                  disabled={actionId === tutor.id}
                                  title="Dar de baja lógica a este tutor"
                                  onClick={() => handleDisableTutor(tutor)}
                                >
                                  {actionId === tutor.id ? 'Procesando...' : 'Dar de baja'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

