import { Link } from 'react-router-dom';

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-5">
          ✉️
        </div>

        <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
          Registro Recibido
        </span>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
          ¡Revisa tu correo electrónico!
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Hemos registrado tus datos y documentos correctamente. Te enviamos un correo desde{' '}
          <strong className="text-slate-800">EduConnect</strong> con tu{' '}
          <strong className="text-teal-700">Token de Verificación</strong>.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs text-slate-600 space-y-2 mb-6">
          <p className="font-bold text-slate-800 uppercase tracking-wider">
            Próximos pasos para ingresar:
          </p>
          <ol className="list-decimal list-inside space-y-1.5">
            <li>Espera el correo de aprobación por parte del Administrador.</li>
            <li>Copia el <strong>Token de 6 caracteres</strong> enviado a tu bandeja de entrada.</li>
            <li>En tu <strong>primer inicio de sesión</strong>, ingresa tu correo, contraseña y el token.</li>
          </ol>
        </div>

        <Link
          to="/login/student"
          className="block w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm text-sm"
        >
          Ir a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}