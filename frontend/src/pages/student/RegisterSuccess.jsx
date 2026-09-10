import { Link } from 'react-router-dom';

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
        <div className="text-5xl mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">¡Registro exitoso!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Tu cuenta está <span className="font-semibold text-yellow-600">pendiente de aprobación</span>{' '}
          por el administrador. Recibirás una notificación cuando sea activada.
        </p>
        <Link to="/login"
              className="inline-block bg-blue-600 text-white text-sm font-semibold
                         px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
          Ir al login
        </Link>
      </div>
    </div>
  );
}