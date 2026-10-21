import { useCallback, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js';
import api from '../../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PRIMARY = '#167963';
const PRIMARY_SOFT = 'rgba(22, 121, 99, 0.35)';
const DANGER = '#b4413c';

// HU-048: Reporte Analítico F2-2
export default function ReportsF2Panel() {
  const [month, setMonth] = useState('');
  const [cancellations, setCancellations] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const params = month ? { month } : {};
    try {
      const [c, h] = await Promise.all([
        api.get('/reports/cancellations-by-subject', { params }),
        api.get('/reports/demanded-schedules', { params }),
      ]);
      setCancellations(c.data.cancellations || []);
      setSchedules(h.data.schedules || []);
      setError('');
    } catch {
      setError('No se pudieron cargar los reportes analíticos.');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { load(); }, [load]);

  const cancelData = {
    labels: cancellations.map((r) => r.materia),
    datasets: [{
      label: 'Tasa de cancelación (%)',
      data: cancellations.map((r) => r.tasa),
      backgroundColor: DANGER,
      borderRadius: 4,
    }],
  };
  const cancelOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const r = cancellations[ctx.dataIndex];
            return `${r.tasa}% (${r.canceladas} de ${r.total} sesiones)`;
          },
        },
      },
    },
    scales: { x: { beginAtZero: true, max: 100, ticks: { callback: (v) => `${v}%` } } },
  };

  // Orden cronológico en el gráfico; se resalta la franja de mayor demanda
  const chrono = [...schedules].sort((a, b) => a.franja.localeCompare(b.franja));
  const maxTotal = Math.max(0, ...schedules.map((s) => s.total));
  const scheduleData = {
    labels: chrono.map((s) => s.franja),
    datasets: [{
      label: 'Sesiones solicitadas',
      data: chrono.map((s) => s.total),
      backgroundColor: chrono.map((s) => (s.total === maxTotal ? PRIMARY : PRIMARY_SOFT)),
      borderRadius: 4,
    }],
  };
  const scheduleOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  const top = schedules[0];

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6" data-testid="reports-f2-panel">
      <div className="flex flex-wrap items-end gap-4">
        <div className="mr-auto">
          <h2 className="text-lg font-semibold text-slate-800">Cancelaciones y horarios demandados</h2>
          <p className="text-sm text-slate-500">Reporte analítico F2-2</p>
        </div>
        <label className="text-sm text-slate-600">
          Mes
          <input
            data-testid="f2-month-filter"
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Cargando…</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Materias con mayor tasa de cancelación</h3>
            {cancellations.length === 0 ? (
              <p className="text-sm text-slate-500">No hay sesiones finalizadas en el período.</p>
            ) : (
              <>
                <div data-testid="cancellation-chart">
                  <Bar data={cancelData} options={cancelOptions} aria-label="Tasa de cancelación por materia" />
                </div>
                <table className="w-full text-sm mt-4" data-testid="cancellation-table">
                  <thead>
                    <tr className="text-left text-slate-500 border-b">
                      <th className="py-2">Materia</th>
                      <th className="text-right">Canceladas</th>
                      <th className="text-right">Total</th>
                      <th className="text-right">Tasa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancellations.map((r) => (
                      <tr key={r.materia} className="border-b last:border-0">
                        <td className="py-2">{r.materia}</td>
                        <td className="text-right">{r.canceladas}</td>
                        <td className="text-right">{r.total}</td>
                        <td className="text-right font-medium">{r.tasa}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          <div>
            <h3 className="font-medium text-slate-700 mb-2">Horarios más demandados</h3>
            {schedules.length === 0 ? (
              <p className="text-sm text-slate-500">No hay sesiones solicitadas en el período.</p>
            ) : (
              <>
                {top && (
                  <p className="text-sm text-slate-600 mb-2" data-testid="top-schedule">
                    Franja con más demanda: <strong>{top.franja}</strong> ({top.total} sesiones)
                  </p>
                )}
                <div data-testid="schedules-chart">
                  <Bar data={scheduleData} options={scheduleOptions} aria-label="Sesiones solicitadas por franja horaria" />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}