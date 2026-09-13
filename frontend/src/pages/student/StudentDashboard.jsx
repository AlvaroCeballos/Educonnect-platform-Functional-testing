import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentData = localStorage.getItem('student');
    const token = localStorage.getItem('token');

    if (!token || !studentData) {
      navigate('/login/student');
      return;
    }

    setStudent(JSON.parse(studentData));
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    navigate('/login/student');
  };

  if (loading) return <div className="page-shell"><p>Cargando...</p></div>;

  return (
    <main className="single-panel">
      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', maxWidth: '100%', margin: '0 auto -32px' }}>
        <h2 style={{ color: '#17233d', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          EduConnect
        </h2>
        <button
          onClick={handleLogout}
          style={{ 
            background: '#14735e', 
            color: 'white', 
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Welcome Section */}
      <div className="schedule-panel" style={{ textAlign: 'center', padding: '48px' }}>
        <h1 style={{ color: '#17233d', fontSize: '48px', marginBottom: '12px' }}>
          Bienvenido, {student?.nombre}
        </h1>
        <p style={{ color: '#758097', fontSize: '18px', marginBottom: '48px' }}>
          ¿Qué deseas hacer hoy?
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/book-session" className="submit-button" style={{ maxWidth: '220px', textDecoration: 'none' }}>
            Agendar sesión
          </a>
          <a href="/my-sessions" className="submit-button" style={{ maxWidth: '220px', textDecoration: 'none' }}>
            Ver mis sesiones
          </a>
        </div>
      </div>
    </main>
  );
}