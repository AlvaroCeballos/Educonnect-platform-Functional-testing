import { useCallback, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from 'chart.js';
import api from '../../utils/api';
import ReportsF2Panel from './ReportsF2Panel';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function MetricsPanel() {
  const [tutors, setTutors] = useState([]);
  const [evolution, setEvolution] = useState([]);
  const [granularity, setGranularity] = useState('month');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [ratingsError, setRatingsError] = useState('');
  const [evolutionError, setEvolutionError] = useState('');

  useEffect(() => {
    api.get('/reports/tutors-ratings')
      .then(({ data }) => setTutors(data.tutorsRatings || []))
      .catch(() => setRatingsError('No se pudo cargar el promedio de calificaciones.'));
  }, []);

  const loadEvolution = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reports/sessions-evolution', {
        params: { granularity, ...(month ? { month } : {}) },
      });
      setEvolution(data.evolution || []);
      setEvolutionError('');
    } catch {
      setEvolutionError('No se pudo cargar la evolución de sesiones.');
    } finally {
      setLoading(false);
    }
  }, [granularity, month]);

  useEffect(() => { loadEvolution(); }, [loadEvolution]);

  const chartData = {
    labels: evolution.map((e) => e.periodo),
    datasets: [{
      label: 'Sesiones atendidas',
      data: evolution.map((e) => e.total),
      borderColor: '#167963',
      backgroundColor: 'rgba(22, 121, 99, 0.15)',
      fill: true,
      tension: 0.3,
    }],
  };
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  return (
    <div className="space-y-8" data-testid="metrics-panel">
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Promedio de calificaciones de tutores</h2>
        {ratingsError && <p className="text-sm text-red-600">{ratingsError}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="ratings-table">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">Tutor</th><th>Especialidad</th>
                <th className="text-right">Promedio</th><th className="text-right">Calificaciones</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-2">{t.nombre} {t.apellido}</td>
                  <td>{t.especialidad}</td>
                  <td className="text-right font-medium">
                    {t.total ? `${t.promedio.toFixed(2)} ★` : 'Sin calificaciones'}
                  </td>
                  <td className="text-right">{t.total}</td>
                </tr>
              ))}
              {tutors.length === 0 && !ratingsError && (
                <tr><td colSpan={4} className="py-4 text-center text-slate-500">No hay tutores activos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <h2 className="text-lg font-semibold text-slate-800 mr-auto">Evolución de sesiones atendidas</h2>
          <label className="text-sm text-slate-600">
            Agrupar por
            <select
              data-testid="granularity-select"
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
              className="block mt-1 border rounded-lg px-2 py-1"
            >
              <option value="month">Mes</option>
              <option value="week">Semana</option>
            </select>
          </label>
          <label className="text-sm text-slate-600">
            Mes
            <input
              data-testid="month-filter"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="block mt-1 border rounded-lg px-2 py-1"
            />
          </label>
          {month && (
            <button type="button" onClick={() => setMonth('')} className="text-sm text-slate-600 underline">
              Limpiar filtro
            </button>
          )}
        </div>
        {evolutionError && <p className="text-sm text-red-600">{evolutionError}</p>}
        {loading ? (
          <p className="text-sm text-slate-500">Cargando…</p>
        ) : evolution.length === 0 ? (
          <p className="text-sm text-slate-500">No hay sesiones atendidas en el período seleccionado.</p>
        ) : (
          <div data-testid="evolution-chart">
            <Line data={chartData} options={options} aria-label="Gráfico de evolución de sesiones atendidas" />
          </div>
        )}
        
      </section>

      <ReportsF2Panel />

    </div>
  );
}
