import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadUsers = useCallback(async () => {
    const response = await api.get('/admin/users', { params: { status: 'PENDING' } });
    setUsers(response.data.users || []);
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

  const updateStatus = async (user, status) => {
    setActionId(user.id);
    setError('');
    setFeedback('');
    try {
      const response = await api.patch(`/admin/users/${user.id}/status`, { status });
      setFeedback(response.data.message);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible actualizar la solicitud.');
    } finally {
      setActionId(null);
    }
  };

  if (loading)
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">EDUCONNECT · ADMINISTRACIÓN</p>
          <h1>Panel administrativo</h1>
          <p>Bienvenido, {admin?.email}</p>
        </div>
        <button className="admin-logout" onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
          navigate('/login');
        }}>Cerrar sesión</button>
      </header>

      <main className="admin-content">
        <section className="admin-section-heading">
          <div>
            <p className="eyebrow">HU-004 · HU-005</p>
            <h2>Solicitudes pendientes</h2>
            <p>Revisa cada registro y decide si puede acceder a la plataforma.</p>
          </div>
          <span className="admin-count">{users.length} pendientes</span>
        </section>

        {error && <div className="feedback error">{error}</div>}
        {feedback && <div className="feedback success">{feedback}</div>}

        <section className="admin-table-card">
          {users.length === 0 ? (
            <div className="admin-empty">No hay solicitudes pendientes.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Usuario</th><th>Rol</th><th>Identificación</th><th>Detalle</th><th>Acciones</th></tr></thead>
                <tbody>{users.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{[user.nombre, user.apellido].filter(Boolean).join(' ') || 'Sin nombre'}</strong><span>{user.email}</span></td>
                    <td><span className={`role-badge ${user.role}`}>{user.role === 'tutor' ? 'Tutor' : 'Estudiante'}</span></td>
                    <td>{user.carnet || '—'}</td>
                    <td>{user.especialidad || 'Registro académico'}</td>
                    <td><div className="admin-actions">
                      <button className="approve-button" disabled={actionId === user.id} onClick={() => updateStatus(user, 'APPROVED')}>Aprobar</button>
                      <button className="reject-button" disabled={actionId === user.id} onClick={() => updateStatus(user, 'REJECTED')}>Rechazar</button>
                    </div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
