import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login/admin');
        return;
      }

      try {
        const response = await api.get('/auth/admin/profile');
        setAdmin(response.data.user);
      } catch (err) {
        console.error('Acceso denegado:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        navigate('/login/admin');
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [navigate]);

  if (loading)
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-blue-600">Panel Administrativo</h1>
          <p className="text-gray-600 mt-2">Bienvenido, {admin?.email}</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="font-semibold text-blue-900">Gestión de Usuarios</h2>
              <p className="text-sm text-gray-600 mt-2">Aprobar/rechazar registros y gestionar cuentas</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="font-semibold text-green-900">Reportes</h2>
              <p className="text-sm text-gray-600 mt-2">Ver análisis de tutorías y demanda</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('admin');
              window.location.href = '/login/admin';
            }}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
