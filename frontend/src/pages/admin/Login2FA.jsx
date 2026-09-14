import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

export default function Login2FA() {
  const location = useLocation();
  const navigate = useNavigate();
  const adminData = location.state?.adminData;

  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-200">
          <p className="text-red-600 font-bold mb-4">Acceso denegado. Completa la Fase 1 primero.</p>
          <Link to="/login" className="text-teal-700 hover:underline font-semibold">Volver al inicio de sesión</Link>
        </div>
      </div>
    );
  }

  // --- LÓGICA DE VALIDACIÓN DEL ARCHIVO ---
  const validateAndSetFile = (selectedFile) => {
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

  // --- EVENTOS DRAG & DROP ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files?.[0]);
  };

  // --- SUBMIT ---
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
        headers: { 'Content-Type': 'multipart/form-data' } 
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
    <div className="flex min-h-screen font-sans">
      <div className="hidden lg:flex flex-col justify-center w-5/12 bg-gray-900 text-white p-16">
        <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6">E</div>
        <h1 className="text-sm tracking-widest font-semibold text-gray-400 mb-4">EDUCONNECT ADMIN</h1>
        <h2 className="text-5xl font-extrabold leading-tight mb-6">Seguridad Avanzada.</h2>
        <p className="text-gray-300 text-lg">La protección de los datos universitarios requiere autenticación de doble factor.</p>
      </div>

      <div className="flex w-full lg:w-7/12 bg-gray-50 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h3 className="text-xs font-bold text-teal-600 tracking-widest uppercase mb-2">Fase 2 de Autenticación</h3>
          <h4 className="text-3xl font-light text-gray-800 mb-2">Validación 2FA</h4>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Usuario autorizado en Fase 1:</p>
              <p className="font-semibold text-gray-900 truncate">{adminData.email}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Archivo de autenticación</label>
              
              {/* ZONA DE ARRASTRE Y CLIC */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex items-center justify-center w-full p-6 border-2 border-dashed rounded-xl transition-colors ${
                  isDragging ? 'border-teal-500 bg-teal-100' : 'border-gray-300 bg-white hover:border-teal-500 hover:bg-teal-50'
                }`}
              >
                <label htmlFor="auth2-file" className="w-full cursor-pointer text-center">
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">📁</div>
                  <p className="text-sm font-semibold text-gray-700">{file ? file.name : 'Subir auth2-ayd1.txt'}</p>
                  <p className="text-xs text-gray-500 mt-1">Haz clic o arrastra el archivo aquí</p>
                </label>
                <input 
                  id="auth2-file" 
                  type="file" 
                  accept=".txt" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  disabled={loading} 
                />
              </div>

            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

            <button type="submit" disabled={loading || !file} className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black disabled:opacity-50 transition-colors mt-4">
              {loading ? 'Validando credenciales...' : 'Validar y acceder al sistema'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Si perdiste acceso a tu archivo de llave maestra, contacta a infraestructura técnica.
          </p>
        </div>
      </div>
    </div>
  );
}