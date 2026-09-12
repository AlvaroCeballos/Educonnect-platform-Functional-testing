import { Link, Routes, Route } from 'react-router-dom';
import TutorRegistration from './TutorRegistration';
import TutorLogin from './TutorLogin';
import ScheduleForm from './ScheduleForm';
import TutorProfile from './TutorProfile';
import RegisterStudent from './pages/student/RegisterStudent';
import RegisterSuccess from './pages/student/RegisterSuccess';
import LoginAdmin from './pages/admin/LoginAdmin';
import Login2FA from './pages/admin/Login2FA';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookSession from './pages/student/BookSession';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center gap-4">
      <Link to="/registro" className="submit-button">Registro estudiante</Link>
      <Link to="/register" className="submit-button">Registro tutor</Link>
      <Link to="/login/admin" className="submit-button">Login admin</Link>
      <Link to="/reservar" className="submit-button">Programar sesión</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<RegisterStudent />} />
      <Route path="/registro-exitoso" element={<RegisterSuccess />} />
      <Route path="/register" element={<TutorRegistration />} />
      <Route path="/login" element={<TutorLogin />} />
      <Route path="/schedule" element={<ScheduleForm />} />
      <Route path="/reservar" element={<BookSession />} />
      <Route path="/profile" element={<TutorProfile />} />
      <Route path="/login/admin" element={<LoginAdmin />} />
      <Route path="/login/admin/2fa" element={<Login2FA />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
