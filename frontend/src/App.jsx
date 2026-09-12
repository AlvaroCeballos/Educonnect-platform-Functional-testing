import { Link, Routes, Route } from 'react-router-dom';
import TutorRegistration from './TutorRegistration';
import TutorLogin from './TutorLogin';
import ScheduleForm from './ScheduleForm';
import TutorProfile from './TutorProfile';
import RegisterStudent from './pages/student/RegisterStudent';
import RegisterSuccess from './pages/student/RegisterSuccess';
import LoginStudent from './pages/student/LoginStudent';
import LoginAdmin from './pages/admin/LoginAdmin';
import Login2FA from './pages/admin/Login2FA';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookSession from './pages/student/BookSession';
import MySessions from './pages/student/MySessions';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center gap-4">
      <Link to="/registro" className="submit-button">Registro estudiante</Link>
      <Link to="/register" className="submit-button">Registro tutor</Link>
      <Link to="/login/student" className="submit-button">Login estudiante</Link>
      <Link to="/login/admin" className="submit-button">Login admin</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<RegisterStudent />} />
      <Route path="/registro-exitoso" element={<RegisterSuccess />} />
      <Route path="/login/student" element={<LoginStudent />} />
      <Route path="/register" element={<TutorRegistration />} />
      <Route path="/login" element={<TutorLogin />} />
      <Route path="/schedule" element={<ScheduleForm />} />
      <Route path="/profile" element={<TutorProfile />} />
      <Route path="/login/admin" element={<LoginAdmin />} />
      <Route path="/login/admin/2fa" element={<Login2FA />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/book-session" element={<BookSession />} />
      <Route path="/my-sessions" element={<MySessions />} />
    </Routes>
  );
}

export default App;
