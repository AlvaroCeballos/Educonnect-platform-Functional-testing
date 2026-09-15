import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    carnet: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const studentData = localStorage.getItem('student');
    const token = localStorage.getItem('token');

    if (!token || !studentData) {
      navigate('/');
      return;
    }

    const data = JSON.parse(studentData);
    setStudent(data);
    setForm({
      nombre: data.nombre || '',
      apellido: data.apellido || '',
      carnet: data.carnet || '',
      newPassword: '',
      confirmPassword: ''
    });
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Preparar datos para enviar
      const updateData = {
        nombre: form.nombre,
        apellido: form.apellido,
        carnet: form.carnet
      };

      // Incluir contraseña solo si se ingresó
      if (form.newPassword) {
        if (form.newPassword !== form.confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }
        if (form.newPassword.length < 8) {
          setError('La contraseña debe tener mínimo 8 caracteres');
          return;
        }
        updateData.newPassword = form.newPassword;
      }

      // Enviar actualización
      await api.put('/students/me/profile', updateData);

      // Actualizar localStorage
      const updatedStudent = { ...student, ...updateData };
      localStorage.setItem('student', JSON.stringify(updatedStudent));
      setStudent(updatedStudent);

      setSuccess('Perfil actualizado correctamente');
      setEditing(false);
      setForm(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  if (loading) return <div className="page-shell"><p>Cargando perfil...</p></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Barra de navegación superior */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-lg shadow-sm">
              E
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              EduConnect
            </span>
          </div>

          <Link
            to="/dashboard/student"
            className="text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95"
          >
            ← Volver al dashboard
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto">

          <h1 className="text-3xl font-bold text-slate-900 mb-8">
            Mi Perfil
          </h1>

          {/* Mensajes */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Display Mode */}
          {!editing && (
            <div style={{ display: 'grid', gap: '24px' }}>
              <div>
                <p style={{ color: '#758097', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Nombre
                </p>
                <p style={{ color: '#17233d', fontSize: '16px', fontWeight: '500' }}>
                  {student?.nombre}
                </p>
              </div>
              <div>
                <p style={{ color: '#758097', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Apellido
                </p>
                <p style={{ color: '#17233d', fontSize: '16px', fontWeight: '500' }}>
                  {student?.apellido}
                </p>
              </div>
              <div>
                <p style={{ color: '#758097', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Carnet
                </p>
                <p style={{ color: '#17233d', fontSize: '16px', fontWeight: '500' }}>
                  {student?.carnet}
                </p>
              </div>
              <div>
                <p style={{ color: '#758097', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Correo (No editable)
                </p>
                <p style={{ color: '#999', fontSize: '16px', fontWeight: '500' }}>
                  {student?.email}
                </p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="submit-button"
                style={{ marginTop: '24px' }}
              >
                Editar Perfil
              </button>
            </div>
          )}

          {/* Edit Mode */}
          {editing && (
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Carnet</label>
                <input
                  type="text"
                  name="carnet"
                  value={form.carnet}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Dejar en blanco para no cambiar"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repetir contraseña"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="submit-button flex-1"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      nombre: student.nombre,
                      apellido: student.apellido,
                      carnet: student.carnet,
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setError('');
                  }}
                  className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
