import { Routes, Route, Navigate, Link } from 'react-router-dom';
import TutorRegistration from './pages/tutor/TutorRegistration';
import ScheduleForm from './ScheduleForm';
import TutorProfile from './pages/tutor/TutorProfile';
import RegisterStudent from './pages/student/RegisterStudent';
import RegisterSuccess from './pages/student/RegisterSuccess';
import Login from './pages/Login';
import Login2FA from './pages/admin/Login2FA';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import BookSession from './pages/student/BookSession';
import MySessions from './pages/student/MySessions';
import SessionHistory from './pages/student/SessionHistory';
import TutorSessions from './pages/tutor/TutorSessions';
import TutorDashboard from './pages/tutor/TutorDashboard'; // <-- Importamos el nuevo dashboard

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Panel de Branding */}
        <div className="md:w-1/2 bg-teal-800 text-white p-12 flex flex-col justify-center items-start">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6">E</div>
          <h1 className="text-4xl font-extrabold mb-4">EduConnect</h1>
          <p className="text-teal-100 text-lg">
            La plataforma definitiva para conectar con tutores expertos, gestionar tus horarios y llevar tu aprendizaje al siguiente nivel.
          </p>
        </div>
        
        {/* Panel de Acciones */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">¡Bienvenido!</h2>
          
          <div className="space-y-4">
            <Link to="/login" className="flex items-center justify-center w-full py-3 px-4 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 transition-colors shadow-md">
              Iniciar Sesión
            </Link>
            
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">¿Nuevo en la plataforma?</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Link to="/registro" className="flex items-center justify-center w-full py-3 px-4 bg-white text-teal-700 border-2 border-teal-700 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-sm">
              Registrarse como Estudiante
            </Link>

            <Link to="/register" className="flex items-center justify-center w-full py-3 px-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm">
              Registrarse como Tutor
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/student" element={<Navigate to="/login" replace />} />
      <Route path="/login/admin" element={<Navigate to="/login" replace />} />
      <Route path="/registro" element={<RegisterStudent />} />
      <Route path="/register" element={<TutorRegistration />} />
      <Route path="/registro-exitoso" element={<RegisterSuccess />} />
      <Route path="/login/admin/2fa" element={<Login2FA />} />

      {/* Rutas Protegidas */}
      <Route path="/dashboard/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/reservar" element={<ProtectedRoute><BookSession /></ProtectedRoute>} />
      <Route path="/book-session" element={<ProtectedRoute><BookSession /></ProtectedRoute>} />
      <Route path="/mis-sesiones" element={<ProtectedRoute><MySessions /></ProtectedRoute>} />
      <Route path="/my-sessions" element={<ProtectedRoute><MySessions /></ProtectedRoute>} />
      <Route path="/historial" element={<ProtectedRoute><SessionHistory /></ProtectedRoute>} />
      
      {/* Rutas del Tutor */}
      <Route path="/tutor/dashboard" element={<ProtectedRoute><TutorDashboard /></ProtectedRoute>} /> {/* <-- Nueva ruta del Dashboard */}
      <Route path="/tutor/sesiones" element={<ProtectedRoute><TutorSessions /></ProtectedRoute>} />
      <Route path="/tutor/profile" element={<ProtectedRoute><TutorProfile /></ProtectedRoute>} />
      
      <Route path="/schedule" element={<ProtectedRoute><ScheduleForm /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  );
}