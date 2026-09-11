import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function Login2FA() {
  const location = useLocation();
  const navigate = useNavigate();
  const adminData = location.state?.adminData;

  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Acceso denegado. Completa Fase 1 primero.</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name !== 'auth2-ayd1.txt') {
        setError('El archivo debe llamarse auth2-ayd1.txt');
        setFile(null);
      } else {
        setFile(selectedFile);
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Por favor selecciona el archivo auth2-ayd1.txt');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('auth2fa', file);
      formData.append('adminId', adminData.adminId);

      const response = await api.post('/auth/login/admin/2fa', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.user));

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar archivo 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">EduConnect</h1>
          <p className="text-gray-500 mt-1">Fase 2: Autenticación 2FA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Email: <span className="font-semibold">{adminData.email}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo de autenticación
            </label>
            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <div className="text-center">
                <svg
                  className="mx-auto h-8 w-8 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-4-4m0 0l-4 4m4-4v12"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-gray-600 mt-2">
                  {file ? file.name : 'Sube auth2-ayd1.txt'}
                </p>
              </div>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </label>
            {file && (
              <p className="text-xs text-green-600 mt-2">✓ Archivo seleccionado: {file.name}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                       text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Validando...' : 'Validar y acceder'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          La autenticación 2FA es obligatoria para acceder al panel de administración.
        </p>
      </div>
    </div>
  );
}
