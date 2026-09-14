// frontend/src/components/TutorScheduleModal.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const DAYS_MAP = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

export default function TutorScheduleModal({ tutor, onClose }) {
  const [generalSchedules, setGeneralSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [availability, setAvailability] = useState(null);
  const [loadingGeneral, setLoadingGeneral] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');

  // Cargar rango general de atención
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.get(`/tutors/${tutor.id}/schedules`);
        setGeneralSchedules(res.data?.horarios || []);
      } catch (err) {
        setError('No se pudo cargar el horario general del tutor.');
      } finally {
        setLoadingGeneral(false);
      }
    };
    fetchSchedules();
  }, [tutor.id]);

  // Cargar bloques de disponibilidad por fecha
  useEffect(() => {
    if (!selectedDate) return;
    const fetchAvailability = async () => {
      setLoadingSlots(true);
      setError('');
      try {
        const res = await api.get(
          `/tutors/${tutor.id}/availability?date=${selectedDate}`
        );
        setAvailability(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al consultar disponibilidad');
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchAvailability();
  }, [tutor.id, selectedDate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Disponibilidad de Horarios
            </span>
            <h2 className="text-base font-bold">
              {tutor.nombre} {tutor.apellido}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Horario General */}
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Jornada de Atención General
            </h3>
            {loadingGeneral ? (
              <div className="h-5 bg-slate-200 animate-pulse rounded w-1/2" />
            ) : generalSchedules.length === 0 ? (
              <p className="text-xs text-amber-600 font-medium">
                Este tutor aún no ha configurado sus días de atención.
              </p>
            ) : (
              <div className="space-y-1 text-xs sm:text-sm text-slate-700">
                <p>
                  <strong className="text-slate-900">Días que atiende:</strong>{' '}
                  {generalSchedules.map((s) => DAYS_MAP[s.day_of_week]).join(', ')}
                </p>
                <p>
                  <strong className="text-slate-900">Rango de horario:</strong>{' '}
                  {String(generalSchedules[0].start_time).slice(0, 5)} hrs a{' '}
                  {String(generalSchedules[0].end_time).slice(0, 5)} hrs
                </p>
              </div>
            )}
          </section>

          {/* Selector de fecha */}
          <section>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Consultar fecha:
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
            />
          </section>

          {/* Cuadrícula de Slots */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Estado de Horarios ({selectedDate})
            </h3>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs mb-3 border border-red-200">
                {error}
              </div>
            )}

            {loadingSlots ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-14 bg-slate-100 animate-pulse rounded-lg border border-slate-200" />
                ))}
              </div>
            ) : availability && !availability.isWorkingDay ? (
              <div className="text-center py-6 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs sm:text-sm font-medium">
                <span className="text-lg block mb-1">📅</span>
                El tutor no atiende los días seleccionados.
              </div>
            ) : availability && availability.slots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availability.slots.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-2.5 rounded-lg border text-center text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all ${
                      slot.available
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                        : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="font-bold text-slate-800">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        slot.available
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {slot.available ? '● Disponible' : '✕ Ocupado'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No hay bloques definidos para esta fecha.</p>
            )}
          </section>
        </div>

        {/* Acciones */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
          >
            Cerrar
          </button>
          <Link
            to={`/book-session?tutorId=${tutor.id}`}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            Ir a agendar sesión
          </Link>
        </div>

      </div>
    </div>
  );
}