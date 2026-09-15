import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const studentData = localStorage.getItem('student');
    const token = localStorage.getItem('token');

    if (!token || !studentData) {
      navigate('/');
      return;
    }

    setStudent(JSON.parse(studentData));
    setLoading(false);
  }, [navigate]);

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
            <div>
              <p className="text-slate-600">Formulario editable aquí (T-022.2)</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
