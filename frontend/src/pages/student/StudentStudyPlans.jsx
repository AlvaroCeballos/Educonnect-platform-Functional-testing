import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const formatDate = (value) => {
  if (!value) return '';
  const str = String(value);
  if (str.length >= 10) return str.slice(0, 10);
  return str;
};

export default function StudentStudyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/study-plans/me')
      .then((res) => setPlans(res.data.plans || []))
      .catch((err) => setError(err.response?.data?.message || 'No se pudieron cargar tus planes de estudio.'))
      .finally(() => setLoading(false));
  }, []);

  const planActivo = plans[0];
  const planesPrevios = plans.slice(1);

  return (
    <main className="single-panel">
      <section className="form-panel schedule-panel">
        <div style={{ marginBottom: '14px' }}>
          <Link
            to="/dashboard/student"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#0f766e', textDecoration: 'none' }}
          >
            ← Volver al dashboard
          </Link>
        </div>

        <div className="form-heading">
          <p className="eyebrow">PLAN DE ESTUDIO</p>
          <h2>Mi plan de estudio</h2>
          <p>Las dificultades identificadas por tu tutor y los recursos recomendados tras cada sesión atendida.</p>
        </div>

        {loading && <p>Cargando…</p>}

        {!loading && error && (
          <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#991b1b' }}>
            {error}
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div style={{
            padding: '48px 32px',
            background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)',
            border: '1px solid #a7f3d0',
            borderRadius: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="9" y1="7" x2="15" y2="7" />
                <line x1="9" y1="11" x2="15" y2="11" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              Aún no tienes planes de estudio
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0, maxWidth: '420px', marginInline: 'auto', lineHeight: 1.5 }}>
              Cuando un tutor marque una de tus sesiones como atendida, el plan con las dificultades identificadas y los recursos recomendados aparecerá acá.
            </p>
            <Link
              to="/reservar"
              style={{
                display: 'inline-block',
                marginTop: '24px',
                padding: '12px 24px',
                background: '#0f766e',
                color: 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
                boxShadow: '0 2px 6px rgba(15, 118, 110, 0.25)',
              }}
            >
              Reservar una sesión
            </Link>
          </div>
        )}

        {!loading && !error && planActivo && (
          <>
            <PlanCard plan={planActivo} activo />
            {planesPrevios.length > 0 && (
              <>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#334155', margin: '28px 0 12px' }}>
                  Planes previos ({planesPrevios.length})
                </h3>
                <div className="session-list">
                  {planesPrevios.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function PlanCard({ plan, activo = false }) {
  return (
    <article
      style={{
        padding: '20px',
        background: activo ? 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)' : '#ffffff',
        border: activo ? '2px solid #10b981' : '1px solid #e2e8f0',
        borderRadius: '14px',
        marginBottom: activo ? '20px' : '12px',
        boxShadow: activo ? '0 2px 8px rgba(16, 185, 129, 0.08)' : 'none',
      }}
    >
      {activo && (
        <span style={{ display: 'inline-block', padding: '3px 10px', background: '#10b981', color: 'white', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderRadius: '9999px', marginBottom: '10px' }}>
          Plan activo
        </span>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', marginBottom: '14px', fontSize: '14px', color: '#475569' }}>
        <div>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tutor</span>
          <strong style={{ color: '#0f172a' }}>{plan.tutor_name}</strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Especialidad</span>
          <span style={{ color: '#0f172a' }}>{plan.tutor_specialty}</span>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Identificación</span>
          <span style={{ color: '#0f172a' }}>{plan.tutor_identification}</span>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha de la sesión</span>
          <span style={{ color: '#0f172a' }}>{formatDate(plan.session_date)}</span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dificultades identificadas</p>
        <p style={{ margin: 0, padding: '12px 14px', background: 'rgba(255,255,255,0.6)', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#1e293b', whiteSpace: 'pre-wrap' }}>
          {plan.dificultades_detectadas}
        </p>
      </div>

      <div>
        <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Recursos recomendados ({plan.recursos?.length ?? 0})
        </p>
        {(!plan.recursos || plan.recursos.length === 0) ? (
          <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Sin recursos asignados.</p>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Nombre</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Tipo</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Descripción de uso</th>
                </tr>
              </thead>
              <tbody>
                {plan.recursos.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: 500 }}>{r.nombre_recurso}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '2px 8px', background: '#e0f2fe', color: '#075985', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                        {r.tipo_recurso}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569', whiteSpace: 'pre-wrap' }}>{r.descripcion_uso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(100,116,139,0.15)' }}>
        <button
          type="button"
          disabled
          title="Disponible al cerrar HU-034 (Sprint 2)"
          style={{ padding: '8px 16px', background: '#e2e8f0', color: '#94a3b8', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'not-allowed' }}
        >
          Descargar constancia PDF
        </button>
      </div>
    </article>
  );
}
