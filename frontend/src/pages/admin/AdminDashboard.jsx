import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import { generateTutorsDemandBlob } from '../../utils/pdfReportGenerator';
import PendingStudents from '../../components/admin/PendingStudents';
import MetricsPanel from '../../components/admin/MetricsPanel';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [reportTutors, setReportTutors] = useState([]);
  const [reportSubjects, setReportSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'tutors' | 'reports' | 'subjects-report'
  const [studentView, setStudentView] = useState('pending'); // 'pending' | 'approved'
  const [tutorView, setTutorView] = useState('pending'); // 'pending' | 'approved'
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [tutorSearchTerm, setTutorSearchTerm] = useState('');
  const [reportSearchTerm, setReportSearchTerm] = useState('');
  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
  const [reportFilterMode, setReportFilterMode] = useState('all'); // 'all' | 'attendedOnly'
  const [subjectFilterMode, setSubjectFilterMode] = useState('all'); // 'all' | 'withSessionsOnly'
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [tutorIncidents, setTutorIncidents] = useState([]);
  const [incidentSearchTerm, setIncidentSearchTerm] = useState('');
  const [incidentStatusFilter, setIncidentStatusFilter] = useState('all'); // 'all' | 'PENDING' | 'RESOLVED_BANNED' | 'DISMISSED'
  const [editStudentForm, setEditStudentForm] = useState({
    nombre: '',
    apellido: '',
    carnet: '',
    universidad: '',
    carrera: '',
    genero: 'UNSPECIFIED',
    fecha_nacimiento: '',
    fotografia_url: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const [pendingRes, approvedRes, reportRes, subjectsReportRes, incidentsRes] = await Promise.all([
        api.get('/admin/users', { params: { status: 'PENDING' } }),
        api.get('/admin/users', { params: { status: 'APPROVED' } }),
        api.get('/reports/top-tutors').catch((err) => { console.warn('Reporte tutores:', err); return { data: { topTutors: [] } }; }),
        api.get('/reports/top-subjects').catch((err) => { console.warn('Reporte materias:', err); return { data: { subjectsReport: [] } }; }),
        api.get('/admin/reports/tutors').catch((err) => { console.error('Error cargando denuncias tutores:', err); return { data: { reports: [] } }; }),
      ]);
      setPendingUsers(pendingRes.data.users || []);
      setApprovedUsers(approvedRes.data.users || []);
      setReportTutors(reportRes.data?.topTutors || []);
      setReportSubjects(subjectsReportRes.data?.subjectsReport || []);
      setTutorIncidents(incidentsRes.data?.reports || []);
    } catch (err) {
      console.error('Error cargando usuarios o reportes:', err);
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
          Nota importante: Esta acción es una baja lógica. El estudiante no podrá volver a iniciar sesión en la plataforma.
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

  const handleOpenEditStudent = (student) => {
    setEditingStudent(student);
    setEditStudentForm({
      nombre: student.nombre || '',
      apellido: student.apellido || '',
      carnet: student.carnet || '',
      universidad: student.universidad || '',
      carrera: student.carrera || '',
      genero: student.genero || 'UNSPECIFIED',
      fecha_nacimiento: student.fecha_nacimiento ? String(student.fecha_nacimiento).substring(0, 10) : '',
      fotografia_url: student.fotografia_url || '',
    });
  };

  const handleSaveEditStudent = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSavingEdit(true);
    try {
      const res = await api.put(`/admin/users/${editingStudent.id}/student-profile`, editStudentForm);
      await Swal.fire({
        icon: 'success',
        title: 'Estudiante actualizado',
        text: res.data.message || 'Los datos han sido actualizados exitosamente.',
        confirmButtonColor: '#167963',
      });
      setEditingStudent(null);
      await loadUsers();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: err.response?.data?.message || 'No fue posible guardar los cambios.',
        confirmButtonColor: '#167963',
      });
    } finally {
      setSavingEdit(false);
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
          Nota importante: Esta acción es una baja lógica. El tutor no podrá iniciar sesión, no aparecerá en el catálogo de estudiantes y se enviará una notificación por correo a <strong>${tutor.email}</strong>.
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

  const handleResolveIncident = async (incident, action) => {
    const isBan = action === 'BAN';
    const roleTitle = isBan ? '¿Dar de baja al tutor por denuncia?' : '¿Rechazar / Desestimar denuncia?';
    const confirmBtnText = isBan ? 'Sí, dar de baja' : 'Sí, rechazar denuncia';
    const confirmBtnColor = isBan ? '#a42e3a' : '#475569';

    const { value: notes, isConfirmed } = await Swal.fire({
      icon: isBan ? 'warning' : 'question',
      title: roleTitle,
      html: `
        <div style="text-align: left; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; margin: 12px 0; font-size: 13px; color: #334155; line-height: 1.6;">
          <p style="margin: 0 0 4px;"><strong>Tutor reportado:</strong> ${incident.reportedNombreCompleto} (${incident.reportedCarnet || '—'})</p>
          <p style="margin: 0 0 4px;"><strong>Estudiante denunciante:</strong> ${incident.reporterNombreCompleto} (${incident.reporterCarnet || '—'})</p>
          <p style="margin: 0 0 4px;"><strong>Falta:</strong> <span style="background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${incident.category}</span></p>
          <p style="margin: 0;"><strong>Motivo:</strong> ${incident.reason}</p>
        </div>
        <p style="font-size: 13px; color: ${isBan ? '#991b1b' : '#64748b'}; font-weight: 600;">
          ${isBan 
            ? 'Esta acción inhabilitará de inmediato la cuenta del tutor (status = DISABLED) y se enviará la notificación por correo.' 
            : 'La denuncia quedará marcada como desestimada y no afectará el estado del tutor.'}
        </p>
        <label style="display:block; text-align:left; font-size:12px; font-weight:600; color:#475569; margin-top:10px; margin-bottom:4px;">
          Motivo o notas de la resolución administrativa (opcional):
        </label>
      `,
      input: 'textarea',
      inputPlaceholder: isBan 
        ? 'Indica el motivo de la sanción disciplinaria...' 
        : 'Indica por qué se desestima la queja...',
      showCancelButton: true,
      confirmButtonText: confirmBtnText,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: '#94a3b8',
    });

    if (!isConfirmed) return;

    setActionId(incident.id);
    try {
      const res = await api.patch(`/admin/reports/${incident.id}/resolve`, {
        action,
        notes: notes || '',
      });
      await Swal.fire({
        icon: 'success',
        title: isBan ? 'Tutor dado de baja' : 'Denuncia desestimada',
        text: res.data.message || 'La resolución ha sido procesada exitosamente.',
        confirmButtonColor: '#167963',
      });
      await loadUsers();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al resolver denuncia',
        text: err.response?.data?.message || 'No fue posible procesar la resolución.',
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

  const pendingTutorIncidentsCount = tutorIncidents.filter((i) => i.status === 'PENDING').length;
  const bannedTutorIncidentsCount = tutorIncidents.filter((i) => i.status === 'RESOLVED_BANNED').length;
  const dismissedTutorIncidentsCount = tutorIncidents.filter((i) => i.status === 'DISMISSED').length;

  const filteredTutorIncidents = tutorIncidents.filter((inc) => {
    if (incidentStatusFilter !== 'all' && inc.status !== incidentStatusFilter) {
      return false;
    }
    if (!incidentSearchTerm.trim()) return true;
    const term = incidentSearchTerm.toLowerCase();
    const tutorName = (inc.reportedNombreCompleto || '').toLowerCase();
    const studentName = (inc.reporterNombreCompleto || '').toLowerCase();
    const category = (inc.category || '').toLowerCase();
    const reason = (inc.reason || '').toLowerCase();
    const carnet = String(inc.reportedCarnet || '').toLowerCase();
    return (
      tutorName.includes(term) ||
      studentName.includes(term) ||
      category.includes(term) ||
      reason.includes(term) ||
      carnet.includes(term)
    );
  });

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

  // Cálculos para HU-026: Tutores
  const maxAttended = reportTutors.length > 0 ? Math.max(...reportTutors.map((t) => t.totalAtendidos)) : 0;
  const totalAttendedAll = reportTutors.reduce((acc, t) => acc + t.totalAtendidos, 0);
  const totalDistinctStudents = reportTutors.reduce((acc, t) => acc + t.estudiantesDistintos, 0);
  const topTutor = reportTutors.length > 0 ? reportTutors[0] : null;

  const filteredReportTutors = reportTutors.filter((t) => {
    if (reportFilterMode === 'attendedOnly' && t.totalAtendidos === 0) return false;
    if (!reportSearchTerm.trim()) return true;
    const term = reportSearchTerm.toLowerCase();
    return (
      t.nombreCompleto.toLowerCase().includes(term) ||
      t.carnet.toLowerCase().includes(term) ||
      t.email.toLowerCase().includes(term) ||
      t.especialidad.toLowerCase().includes(term) ||
      t.universidad.toLowerCase().includes(term)
    );
  });

  // Cálculos para HU-027: Materias
  const totalSessionsAllSubjects = reportSubjects.reduce((acc, s) => acc + s.totalSesiones, 0);
  const maxSubjectSessions = reportSubjects.length > 0 ? Math.max(...reportSubjects.map((s) => s.totalSesiones)) : 0;
  const topSubject = reportSubjects.length > 0 && reportSubjects[0].totalSesiones > 0 ? reportSubjects[0] : null;

  const filteredReportSubjects = reportSubjects.filter((s) => {
    if (subjectFilterMode === 'withSessionsOnly' && s.totalSesiones === 0) return false;
    if (!subjectSearchTerm.trim()) return true;
    return s.materia.toLowerCase().includes(subjectSearchTerm.toLowerCase());
  });

  const downloadCSV = () => {
    if (reportTutors.length === 0) return;
    const dateStr = new Date().toISOString().slice(0, 10);
    const headers = ['Ranking', 'Tutor', 'Correo', 'Carnet', 'Especialidad', 'Universidad', 'Estado', 'Sesiones Atendidas', 'Estudiantes Distintos'];
    const rows = reportTutors.map((t) => [
      t.ranking,
      `"${t.nombreCompleto}"`,
      `"${t.email}"`,
      `"${t.carnet}"`,
      `"${t.especialidad}"`,
      `"${t.universidad}"`,
      `"${t.userStatus === 'APPROVED' ? 'Activo' : 'Dado de baja'}"`,
      t.totalAtendidos,
      t.estudiantesDistintos,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `reporte_tutores_demanda_${dateStr}.csv`;
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    setTimeout(() => URL.revokeObjectURL(csvUrl), 2000);
  };

  const downloadSubjectsCSV = () => {
    if (reportSubjects.length === 0) return;
    const dateStr = new Date().toISOString().slice(0, 10);
    const headers = ['Ranking', 'Materia', 'Total Sesiones', 'Sesiones Atendidas', 'Sesiones Pendientes', 'Porcentaje Demanda'];
    const rows = reportSubjects.map((s) => [
      s.ranking,
      `"${s.materia}"`,
      s.totalSesiones,
      s.sesionesAtendidas,
      s.sesionesPendientes,
      `${s.porcentaje}%`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `reporte_materias_demanda_${dateStr}.csv`;
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    setTimeout(() => URL.revokeObjectURL(csvUrl), 2000);
  };

  const downloadPDF = () => {
    if (reportTutors.length === 0) return;
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const pdfBlob = generateTutorsDemandBlob(
        {
          topTutors: reportTutors,
          totalAttendedAll,
          totalDistinctStudents,
          topTutor,
          generatedAt: new Date().toISOString(),
        },
        admin
      );

      const pdfUrl = URL.createObjectURL(pdfBlob);
      const pdfLink = document.createElement('a');
      pdfLink.href = pdfUrl;
      pdfLink.download = `reporte_tutores_demanda_${dateStr}.pdf`;
      document.body.appendChild(pdfLink);
      pdfLink.click();
      document.body.removeChild(pdfLink);
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 2000);
    } catch (err) {
      console.error('Error al descargar PDF:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al generar PDF',
        text: 'Ocurrió un problema generando el documento PDF.',
        confirmButtonColor: '#167963',
      });
    }
  };

  const handleExportReports = () => {
    if (reportTutors.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin datos',
        text: 'No hay datos de tutores para exportar en este momento.',
        confirmButtonColor: '#167963',
      });
      return;
    }

    downloadCSV();
    setTimeout(() => {
      downloadPDF();
    }, 150);

    Swal.fire({
      icon: 'success',
      title: 'Reportes exportados',
      html: `
        <div style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 12px;">
          Se iniciaron las descargas de los reportes en formato <strong>CSV</strong> y <strong>PDF</strong>.
        </div>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 12px;">
          Si tu navegador bloqueó la segunda descarga automática, descárgalos directamente:
        </div>
        <div style="display: flex; justify-content: center; gap: 10px;">
          <button id="swal-dl-pdf" class="swal2-confirm swal2-styled" style="background: #0f766e; padding: 7px 16px; font-size: 12px; border-radius: 6px; margin: 0;">Descargar PDF</button>
          <button id="swal-dl-csv" class="swal2-confirm swal2-styled" style="background: #1e293b; padding: 7px 16px; font-size: 12px; border-radius: 6px; margin: 0;">Descargar CSV</button>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        document.getElementById('swal-dl-pdf')?.addEventListener('click', () => downloadPDF());
        document.getElementById('swal-dl-csv')?.addEventListener('click', () => downloadCSV());
      },
    });
  };

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

        {/* Pestañas para separar Estudiantes, Tutores y los dos Reportes */}
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
          <button
            type="button"
            className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reporte Tutores (HU-026)
            <span className="admin-tab-count">{totalAttendedAll}</span>
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'subjects-report' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects-report')}
          >
            Reporte Materias (HU-027)
            <span className="admin-tab-count">{totalSessionsAllSubjects}</span>
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            Métricas
          </button>
        </div>

        {activeTab === 'metrics' && <MetricsPanel />}
        {/* TAB 1: MÓDULO DE ESTUDIANTES (HU-004 y HU-024) */}
        {activeTab === 'students' && (
          <div>
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

            {studentView === 'pending' && (
              <PendingStudents />
            )}

            {studentView === 'approved' && (
              <section className="admin-table-card">
                <div className="admin-tab-header">
                  <h3>Administración de Estudiantes Aprobados (HU-024)</h3>
                  <p>Consulta a los estudiantes activos. Puedes dar de baja a una cuenta para revocar su acceso.</p>
                </div>

                <div className="admin-search-bar">
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Buscar por carnet, nombre o correo..."
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
                              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
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
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  className="edit-button"
                                  title="Editar datos del estudiante (correo inmutable)"
                                  onClick={() => handleOpenEditStudent(student)}
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  className="disable-button"
                                  disabled={actionId === student.id}
                                  title="Dar de baja lógica a este estudiante"
                                  onClick={() => handleDisableStudent(student)}
                                >
                                  {actionId === student.id ? 'Procesando...' : 'Dar de baja'}
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

        {/* TAB 2: MÓDULO DE TUTORES (HU-005 y HU-025) */}
        {activeTab === 'tutors' && (
          <div>
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
              <button
                type="button"
                className={`admin-subtab ${tutorView === 'incidents' ? 'active' : ''}`}
                onClick={() => {
                  setTutorView('incidents');
                  loadUsers();
                }}
              >
                Denuncias Recibidas (HU-043)
                <span
                  className="badge-sub"
                  style={
                    pendingTutorIncidentsCount > 0
                      ? { background: '#fee2e2', color: '#991b1b', fontWeight: 800 }
                      : undefined
                  }
                >
                  {tutorIncidents.length}
                </span>
              </button>
            </div>

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
                                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                                  DPI: {tutor.identificacion || '—'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge-specialty">{tutor.especialidad || 'General'}</span>
                              {tutor.anio_inicio_experiencia && (
                                <span style={{ fontSize: '11px', color: '#475569', display: 'block', marginTop: '4px' }}>
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

            {tutorView === 'approved' && (
              <section className="admin-table-card">
                <div className="admin-tab-header">
                  <h3>Administración de Tutores Aprobados (HU-025)</h3>
                  <p>Consulta los tutores acreditados en el sistema y gestiona la baja lógica con notificación por correo.</p>
                </div>

                <div className="admin-search-bar">
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Buscar por nombre, carnet, especialidad o correo..."
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

            {/* SECCIÓN HU-043: PANEL DE DENUNCIAS CONTRA TUTORES */}
            {tutorView === 'incidents' && (
              <section className="admin-table-card">
                <div className="admin-tab-header">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3>Moderación de Denuncias contra Tutores (HU-043)</h3>
                      <p>
                        Supervisa las faltas disciplinarias reportadas por estudiantes en tutorías atendidas.
                        Puedes dar de baja al tutor si la falta amerita sanción o desestimar el reporte.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={`report-filter-toggle ${incidentStatusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setIncidentStatusFilter('all')}
                      >
                        Todas ({tutorIncidents.length})
                      </button>
                      <button
                        type="button"
                        className={`report-filter-toggle ${incidentStatusFilter === 'PENDING' ? 'active' : ''}`}
                        onClick={() => setIncidentStatusFilter('PENDING')}
                      >
                        Pendientes ({pendingTutorIncidentsCount})
                      </button>
                      <button
                        type="button"
                        className={`report-filter-toggle ${incidentStatusFilter === 'RESOLVED_BANNED' ? 'active' : ''}`}
                        onClick={() => setIncidentStatusFilter('RESOLVED_BANNED')}
                      >
                        Sancionados ({bannedTutorIncidentsCount})
                      </button>
                      <button
                        type="button"
                        className={`report-filter-toggle ${incidentStatusFilter === 'DISMISSED' ? 'active' : ''}`}
                        onClick={() => setIncidentStatusFilter('DISMISSED')}
                      >
                        Desestimadas ({dismissedTutorIncidentsCount})
                      </button>
                    </div>
                  </div>
                </div>

                <div className="admin-search-bar">
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Buscar por tutor, estudiante, falta o motivo..."
                    value={incidentSearchTerm}
                    onChange={(e) => setIncidentSearchTerm(e.target.value)}
                  />
                  {incidentSearchTerm && (
                    <button
                      type="button"
                      className="admin-clear-search"
                      onClick={() => setIncidentSearchTerm('')}
                    >
                      Limpiar
                    </button>
                  )}
                  <span style={{ fontSize: '13px', color: '#64748b', marginLeft: 'auto' }}>
                    {filteredTutorIncidents.length} de {tutorIncidents.length} denuncias
                  </span>
                </div>

                {tutorIncidents.length === 0 ? (
                  <div className="admin-empty">No hay denuncias disciplinarias registradas contra tutores.</div>
                ) : filteredTutorIncidents.length === 0 ? (
                  <div className="admin-empty">No se encontraron denuncias con el criterio seleccionado.</div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Fecha Reporte</th>
                          <th>Tutor Denunciado</th>
                          <th>Estudiante Denunciante</th>
                          <th>Falta Disciplinaria</th>
                          <th>Motivo y Explicación</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTutorIncidents.map((incident) => (
                          <tr key={incident.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                                {formatDate(incident.createdAt)}
                              </strong>
                              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                                Sesión: {formatDate(incident.sessionDate)} ({incident.materia})
                              </span>
                            </td>
                            <td>
                              <div className="admin-user-info">
                                <div>
                                  <strong>{incident.reportedNombreCompleto}</strong>
                                  <span>{incident.reportedEmail}</span>
                                  <span style={{ fontSize: '11px', color: '#0f766e' }}>
                                    Carnet: {incident.reportedCarnet} · {incident.reportedEspecialidad}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong style={{ fontSize: '13px', color: '#334155' }}>
                                  {incident.reporterNombreCompleto}
                                </strong>
                                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>
                                  Carnet: {incident.reporterCarnet}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge-category">{incident.category}</span>
                            </td>
                            <td style={{ maxWidth: '280px' }}>
                              <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                                {incident.reason}
                              </p>
                              {incident.adminNotes && (
                                <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#0f766e', fontStyle: 'italic' }}>
                                  Resolución: {incident.adminNotes}
                                </p>
                              )}
                            </td>
                            <td>
                              {incident.status === 'PENDING' ? (
                                <span className="badge-incident-pending">PENDIENTE</span>
                              ) : incident.status === 'RESOLVED_BANNED' ? (
                                <span className="badge-incident-banned">SANCIONADO</span>
                              ) : (
                                <span className="badge-incident-dismissed">DESESTIMADA</span>
                              )}
                            </td>
                            <td>
                              {incident.status === 'PENDING' ? (
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                  <button
                                    type="button"
                                    className="ban-button"
                                    disabled={actionId === incident.id}
                                    title="Dar de baja definitiva al tutor infractor"
                                    onClick={() => handleResolveIncident(incident, 'BAN')}
                                  >
                                    Dar de baja
                                  </button>
                                  <button
                                    type="button"
                                    className="dismiss-button"
                                    disabled={actionId === incident.id}
                                    title="Desestimar denuncia por falta de mérito"
                                    onClick={() => handleResolveIncident(incident, 'DISMISS')}
                                  >
                                    Rechazar
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                                  Resuelta
                                </span>
                              )}
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

        {/* TAB 3: REPORTE DE TUTORES CON MÁS ESTUDIANTES ATENDIDOS (HU-026) */}
        {activeTab === 'reports' && (
          <section className="admin-table-card">
            <div className="admin-tab-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3>Reporte: Tutores con Más Estudiantes Atendidos (HU-026)</h3>
                  <p>Ranking de demanda docente basado exclusivamente en sesiones en estado Atendido (ATTENDED).</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="export-csv-button"
                    onClick={handleExportReports}
                    title="Descargar ambos reportes (CSV y PDF)"
                  >
                    Exportar Reportes
                  </button>
                  <button
                    type="button"
                    className="report-filter-toggle"
                    onClick={downloadPDF}
                    title="Descargar únicamente el reporte en formato PDF"
                    style={{ padding: '8px 12px', fontWeight: 600 }}
                  >
                    PDF
                  </button>
                  <button
                    type="button"
                    className="report-filter-toggle"
                    onClick={downloadCSV}
                    title="Descargar únicamente el reporte en formato CSV"
                    style={{ padding: '8px 12px', fontWeight: 600 }}
                  >
                    CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjetas KPI */}
            <div className="report-metrics-grid">
              <div className="metric-card success">
                <span className="metric-title">Sesiones Atendidas</span>
                <span className="metric-value">{totalAttendedAll}</span>
                <span className="metric-desc">Total histórico en estado ATTENDED</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Estudiantes Beneficiados</span>
                <span className="metric-value">{totalDistinctStudents}</span>
                <span className="metric-desc">Estudiantes únicos atendidos</span>
              </div>
              <div className="metric-card accent">
                <span className="metric-title">Tutor #1 en Demanda</span>
                <span className="metric-value" style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {topTutor && topTutor.totalAtendidos > 0 ? `#1 ${topTutor.nombreCompleto}` : '— Sin sesiones'}
                </span>
                <span className="metric-desc">
                  {topTutor && topTutor.totalAtendidos > 0 ? `${topTutor.totalAtendidos} sesiones · ${topTutor.especialidad}` : 'Ningún tutor ha completado sesiones aún'}
                </span>
              </div>
            </div>

            {/* Filtros */}
            <div className="admin-search-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Buscar en el ranking por nombre, carnet o especialidad..."
                value={reportSearchTerm}
                onChange={(e) => setReportSearchTerm(e.target.value)}
              />
              {reportSearchTerm && (
                <button
                  type="button"
                  className="admin-clear-search"
                  onClick={() => setReportSearchTerm('')}
                >
                  Limpiar
                </button>
              )}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className={`report-filter-toggle ${reportFilterMode === 'all' ? 'active' : ''}`}
                  onClick={() => setReportFilterMode('all')}
                >
                  Todos ({reportTutors.length})
                </button>
                <button
                  type="button"
                  className={`report-filter-toggle ${reportFilterMode === 'attendedOnly' ? 'active' : ''}`}
                  onClick={() => setReportFilterMode('attendedOnly')}
                >
                  Solo con Atenciones ({reportTutors.filter((t) => t.totalAtendidos > 0).length})
                </button>
              </div>
              <span style={{ fontSize: '13px', color: '#64748b', marginLeft: 'auto' }}>
                Mostrando <strong>{filteredReportTutors.length}</strong> tutores en el ranking
              </span>
            </div>

            {filteredReportTutors.length === 0 ? (
              <div className="admin-empty">
                {reportSearchTerm
                  ? `No se encontraron tutores que coincidan con "${reportSearchTerm}".`
                  : 'No hay registros de tutores en este filtro.'}
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '70px', textAlign: 'center' }}>Ranking</th>
                      <th>Tutor</th>
                      <th>Especialidad / Universidad</th>
                      <th style={{ textAlign: 'center' }}>Estudiantes Atendidos</th>
                      <th style={{ textAlign: 'center' }}>Sesiones Atendidas</th>
                      <th style={{ minWidth: '160px' }}>Nivel de Demanda</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReportTutors.map((tutor) => {
                      const percentage = maxAttended > 0 ? Math.round((tutor.totalAtendidos / maxAttended) * 100) : 0;
                      return (
                        <tr key={tutor.tutorId}>
                          <td style={{ textAlign: 'center' }}>
                            {tutor.ranking === 1 && tutor.totalAtendidos > 0 ? (
                              <span className="ranking-medal medal-1" title="1er Lugar en demanda">#1</span>
                            ) : tutor.ranking === 2 && tutor.totalAtendidos > 0 ? (
                              <span className="ranking-medal medal-2" title="2do Lugar en demanda">#2</span>
                            ) : tutor.ranking === 3 && tutor.totalAtendidos > 0 ? (
                              <span className="ranking-medal medal-3" title="3er Lugar en demanda">#3</span>
                            ) : (
                              <span className="ranking-medal medal-other">#{tutor.ranking}</span>
                            )}
                          </td>
                          <td>
                            <div className="admin-user-info">
                              <div
                                className="admin-avatar-wrapper"
                                onClick={() => handleViewTutorDetails({ ...tutor, id: tutor.userId, status: tutor.userStatus })}
                                title="Ver expediente del tutor"
                              >
                                {tutor.fotografiaUrl ? (
                                  <img
                                    src={resolveMediaUrl(tutor.fotografiaUrl)}
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
                                  style={{ display: tutor.fotografiaUrl ? 'none' : 'flex' }}
                                >
                                  {(tutor.nombre?.[0] || 'T').toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <strong>{tutor.nombreCompleto}</strong>
                                <span>{tutor.email}</span>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>Carnet: {tutor.carnet}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge-specialty">{tutor.especialidad}</span>
                            <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '3px' }}>
                              {tutor.universidad}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <strong style={{ fontSize: '15px', color: '#0f172a' }}>{tutor.estudiantesDistintos}</strong>
                            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>estudiantes</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <strong style={{ fontSize: '16px', color: '#0f766e' }}>{tutor.totalAtendidos}</strong>
                            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>citas completadas</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div className="demand-bar-wrap">
                                <div className="demand-bar-fill" style={{ width: `${percentage}%` }} />
                              </div>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '35px' }}>
                                {percentage}%
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={tutor.userStatus === 'APPROVED' ? 'badge-status-active' : 'badge-specialty'} style={tutor.userStatus !== 'APPROVED' ? { background: '#fef2f2', color: '#991b1b', borderColor: '#fca5a5' } : {}}>
                              {tutor.userStatus === 'APPROVED' ? 'ACTIVO' : 'DADO DE BAJA'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="detail-button"
                              title="Ver información del tutor"
                              onClick={() => handleViewTutorDetails({ ...tutor, id: tutor.userId, status: tutor.userStatus })}
                            >
                              Detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* TAB 4: REPORTE DE MATERIAS CON MAYOR DEMANDA (HU-027) */}
        {activeTab === 'subjects-report' && (
          <section className="admin-table-card">
            <div className="admin-tab-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3>Reporte: Materias con Mayor Demanda (HU-027)</h3>
                  <p>Análisis de materias que más sesiones han generado en la plataforma.</p>
                </div>
                <div>
                  <button
                    type="button"
                    className="export-csv-button"
                    onClick={downloadSubjectsCSV}
                    title="Descargar reporte de materias en formato CSV"
                  >
                    Descargar CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjetas KPI de Resumen */}
            <div className="report-metrics-grid">
              <div className="metric-card success">
                <span className="metric-title">Total Sesiones Generadas</span>
                <span className="metric-value">{totalSessionsAllSubjects}</span>
                <span className="metric-desc">Sesiones totales registradas</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Materias Ofertadas</span>
                <span className="metric-value">{reportSubjects.length}</span>
                <span className="metric-desc">Materias activas en catálogo</span>
              </div>
              <div className="metric-card accent">
                <span className="metric-title">Materia #1 en Demanda</span>
                <span className="metric-value" style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {topSubject ? `#1 ${topSubject.materia}` : '— Sin sesiones'}
                </span>
                <span className="metric-desc">
                  {topSubject ? `${topSubject.totalSesiones} sesiones (${topSubject.porcentaje}% del total)` : 'No hay reservas registradas'}
                </span>
              </div>
            </div>

            {/* Barra de Búsqueda y Filtro */}
            <div className="admin-search-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Buscar materia en el ranking..."
                value={subjectSearchTerm}
                onChange={(e) => setSubjectSearchTerm(e.target.value)}
              />
              {subjectSearchTerm && (
                <button
                  type="button"
                  className="admin-clear-search"
                  onClick={() => setSubjectSearchTerm('')}
                >
                  Limpiar
                </button>
              )}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className={`report-filter-toggle ${subjectFilterMode === 'all' ? 'active' : ''}`}
                  onClick={() => setSubjectFilterMode('all')}
                >
                  Todas ({reportSubjects.length})
                </button>
                <button
                  type="button"
                  className={`report-filter-toggle ${subjectFilterMode === 'withSessionsOnly' ? 'active' : ''}`}
                  onClick={() => setSubjectFilterMode('withSessionsOnly')}
                >
                  Con Sesiones ({reportSubjects.filter((s) => s.totalSesiones > 0).length})
                </button>
              </div>
              <span style={{ fontSize: '13px', color: '#64748b', marginLeft: 'auto' }}>
                Mostrando <strong>{filteredReportSubjects.length}</strong> materias
              </span>
            </div>

            {/* Tabla de Ranking */}
            {filteredReportSubjects.length === 0 ? (
              <div className="admin-empty">No se encontraron materias con el criterio seleccionado.</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '70px', textAlign: 'center' }}>Ranking</th>
                      <th>Materia</th>
                      <th style={{ textAlign: 'center' }}>Estudiantes Únicos</th>
                      <th style={{ textAlign: 'center' }}>Sesiones Atendidas</th>
                      <th style={{ textAlign: 'center' }}>Sesiones Pendientes</th>
                      <th style={{ textAlign: 'center' }}>Total Sesiones</th>
                      <th style={{ minWidth: '170px' }}>Distribución de Demanda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReportSubjects.map((sub) => {
                      const barPercent = maxSubjectSessions > 0 ? Math.round((sub.totalSesiones / maxSubjectSessions) * 100) : 0;
                      return (
                        <tr key={sub.subjectId}>
                          <td style={{ textAlign: 'center' }}>
                            {sub.ranking === 1 && sub.totalSesiones > 0 ? (
                              <span className="ranking-medal medal-1" title="Materia más demandada">#1</span>
                            ) : sub.ranking === 2 && sub.totalSesiones > 0 ? (
                              <span className="ranking-medal medal-2" title="2do Lugar">#2</span>
                            ) : sub.ranking === 3 && sub.totalSesiones > 0 ? (
                              <span className="ranking-medal medal-3" title="3er Lugar">#3</span>
                            ) : (
                              <span className="ranking-medal medal-other">#{sub.ranking}</span>
                            )}
                          </td>
                          <td>
                            <strong style={{ fontSize: '14px', color: '#0f172a' }}>{sub.materia}</strong>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                              {sub.estudiantesUnicos}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f766e' }}>
                              {sub.sesionesAtendidas}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#b45309' }}>
                              {sub.sesionesPendientes}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <strong style={{ fontSize: '15px', color: '#0f766e' }}>
                              {sub.totalSesiones}
                            </strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div className="demand-bar-wrap">
                                <div className="demand-bar-fill" style={{ width: `${barPercent}%` }} />
                              </div>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '35px' }}>
                                {sub.porcentaje}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* MODAL HU-041: Edición de perfil de estudiante (correo inmutable) */}
        {editingStudent && (
          <div className="admin-modal-overlay" onClick={() => setEditingStudent(null)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h3>Editar Estudiante (HU-041)</h3>
                  <p>Modifica la información académica. El correo electrónico institucional es inmutable.</p>
                </div>
                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setEditingStudent(null)}
                  title="Cerrar modal"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEditStudent} className="admin-modal-form">
                <div className="admin-form-group">
                  <label>
                    Correo Electrónico
                    <span className="badge-immutable">Inmutable</span>
                  </label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    disabled
                    className="admin-input-disabled"
                  />
                  <small className="admin-input-hint">
                    Por normativas de seguridad e identidad USAC, el correo no puede ser modificado.
                  </small>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      required
                      value={editStudentForm.nombre}
                      onChange={(e) => setEditStudentForm({ ...editStudentForm, nombre: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Apellido *</label>
                    <input
                      type="text"
                      required
                      value={editStudentForm.apellido}
                      onChange={(e) => setEditStudentForm({ ...editStudentForm, apellido: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Carnet Universitario *</label>
                    <input
                      type="text"
                      required
                      value={editStudentForm.carnet}
                      onChange={(e) => setEditStudentForm({ ...editStudentForm, carnet: e.target.value })}
                      className="admin-input"
                      style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Género</label>
                    <select
                      value={editStudentForm.genero}
                      onChange={(e) => setEditStudentForm({ ...editStudentForm, genero: e.target.value })}
                      className="admin-select"
                    >
                      <option value="UNSPECIFIED">No especificado</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="OTHER">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Universidad</label>
                    <input
                      type="text"
                      value={editStudentForm.universidad}
                      onChange={(e) => setEditStudentForm({ ...editStudentForm, universidad: e.target.value })}
                      className="admin-input"
                      placeholder="Ej. USAC"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Carrera</label>
                    <input
                      type="text"
                      value={editStudentForm.carrera}
                      onChange={(e) => setEditStudentForm({ ...editStudentForm, carrera: e.target.value })}
                      className="admin-input"
                      placeholder="Ej. Ingeniería en Sistemas"
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={editStudentForm.fecha_nacimiento}
                      onChange={(e) => setEditStudentForm({ ...editStudentForm, fecha_nacimiento: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>URL de Fotografía</label>
                    <input
                      type="text"
                      value={editStudentForm.fotografia_url}
                      onChange={(e) => setEditStudentForm({ ...editStudentForm, fotografia_url: e.target.value })}
                      className="admin-input"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-button-secondary"
                    onClick={() => setEditingStudent(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="admin-button-primary"
                  >
                    {savingEdit ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}