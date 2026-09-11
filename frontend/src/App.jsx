import { Link, Routes, Route } from 'react-router-dom';
import TutorRegistration from './TutorRegistration';
import TutorLogin from './TutorLogin';
import ScheduleForm from './ScheduleForm';
import TutorProfile from './TutorProfile';
import RegisterStudent from './pages/student/RegisterStudent';
import RegisterSuccess from './pages/student/RegisterSuccess';

function Home() {
  return <div className="min-h-screen flex items-center justify-center gap-4"><Link to="/registro" className="submit-button">Registro estudiante</Link><Link to="/register" className="submit-button">Registro tutor</Link><Link to="/login" className="submit-button">Login tutor</Link></div>;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/registro" element={<RegisterStudent />} />
    <Route path="/registro-exitoso" element={<RegisterSuccess />} />
    <Route path="/register" element={<TutorRegistration />} />
    <Route path="/login" element={<TutorLogin />} />
    <Route path="/tutor/login" element={<TutorLogin />} />
    <Route path="/schedule" element={<ScheduleForm />} />
    <Route path="/tutor/schedule" element={<ScheduleForm />} />
    <Route path="/schedule/edit" element={<ScheduleForm editing />} />
    <Route path="/tutor/schedule/edit" element={<ScheduleForm editing />} />
    <Route path="/profile" element={<TutorProfile />} />
    <Route path="/tutor/profile" element={<TutorProfile />} />
  </Routes>;
}
