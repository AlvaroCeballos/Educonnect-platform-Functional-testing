import { Routes, Route } from 'react-router-dom';
import RegisterStudent from './pages/student/RegisterStudent';
import RegisterSuccess from './pages/student/RegisterSuccess';
import LoginAdmin from './pages/admin/LoginAdmin';
import Login2FA from './pages/admin/Login2FA';

function App() {
  return (
    <Routes>
      <Route path="/"                  element={<div className="flex min-h-screen items-center justify-center"><h1 className="text-3xl font-bold text-blue-600">EduConnect </h1></div>} />
      <Route path="/registro"          element={<RegisterStudent />} />
      <Route path="/registro-exitoso"  element={<RegisterSuccess />} />
      <Route path="/login/admin"       element={<LoginAdmin />} />
      <Route path="/login/admin/2fa"   element={<Login2FA />} />
    </Routes>
  );
}

export default App;