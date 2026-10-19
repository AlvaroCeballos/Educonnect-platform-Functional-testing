import { useEffect, useState } from 'react';
import api from '../../utils/api';
import PdfViewer from '../PdfViewer';

const getBackendOrigin = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  }
  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const normalizedPath = url.startsWith('/') ? url : `/uploads/${url}`;
  return `${getBackendOrigin()}${normalizedPath}`;
};

export const resolveTutorCvUrl = (cvUrl) => {
  if (!cvUrl) return '';
  if (/^https?:\/\//i.test(cvUrl)) return cvUrl;
  const filename = String(cvUrl).split('/').pop();
  return `${getBackendOrigin()}/api/documents/cvs/${encodeURIComponent(filename)}`;
};

const formatGender = (gender) => {
  if (gender === 'M') return 'Masculino';
  if (gender === 'F') return 'Femenino';
  if (gender === 'OTHER') return 'Otro';
  return 'No especificado';
};

export default function PendingTutors() {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPendingTutors = async () => {
      try {
        const response = await api.get('/admin/tutors/pending');
        if (isMounted) setTutors(response.data.tutors || []);
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message
              || 'No fue posible cargar los tutores pendientes.',
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPendingTutors();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Solicitudes de Registro de Tutores (HU-040)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Revisa la fotografía, datos profesionales y el CV en formato PDF antes de aprobar o rechazar cada solicitud.
          </p>
        </header>

        {error && (
          <p role="alert" className="mx-5 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="p-5 text-sm text-slate-600">Cargando solicitudes de tutores…</p>
        ) : tutors.length === 0 ? (
          <p className="p-5 text-sm text-slate-600">
            No hay solicitudes de tutores pendientes de aprobación.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3">Tutor</th>
                  <th scope="col" className="px-5 py-3">Carnet / ID</th>
                  <th scope="col" className="px-5 py-3">Género</th>
                  <th scope="col" className="px-5 py-3">Especialidad</th>
                  <th scope="col" className="px-5 py-3">Correo</th>
                  <th scope="col" className="px-5 py-3">CV PDF</th>
                  <th scope="col" className="px-5 py-3">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tutors.map((tutor) => {
                  const fullName = [tutor.nombre, tutor.apellido].filter(Boolean).join(' ') || 'Sin nombre';
                  const photoUrl = resolveMediaUrl(tutor.fotografia_url);

                  return (
                    <tr key={tutor.id} className="text-slate-700">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={fullName}
                              className="h-10 w-10 rounded-full object-cover border border-emerald-600"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">
                              {(tutor.nombre?.[0] || 'T').toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-slate-900">{fullName}</div>
                            <div className="text-xs text-slate-500">{tutor.universidad || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-mono font-semibold text-slate-800">{tutor.carnet || '—'}</div>
                        <div className="text-xs text-slate-500">ID: {tutor.identificacion || '—'}</div>
                      </td>
                      <td className="px-5 py-4">{formatGender(tutor.genero)}</td>
                      <td className="px-5 py-4">
                        <span className="inline-block rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
                          {tutor.especialidad || 'General'}
                        </span>
                      </td>
                      <td className="px-5 py-4">{tutor.email}</td>
                      <td className="px-5 py-4">
                        {tutor.cv_pdf_url ? (
                          <span className="text-xs font-semibold text-emerald-700">CV disponible</span>
                        ) : (
                          <span className="text-xs text-amber-700">Sin CV</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedTutor(tutor)}
                          className="rounded-lg bg-emerald-700 px-3 py-2 font-medium text-white hover:bg-emerald-800"
                        >
                          Revisar CV
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedTutor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedTutor(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutor-review-title"
            className="my-auto w-full max-w-4xl rounded-xl bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 id="tutor-review-title" className="text-lg font-semibold text-slate-900">
                  Revisar solicitud y CV del tutor
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {[selectedTutor.nombre, selectedTutor.apellido].filter(Boolean).join(' ')}
                  {' · Carnet: '}{selectedTutor.carnet || '—'}
                  {' · ID: '}{selectedTutor.identificacion || '—'}
                  {' · Especialidad: '}{selectedTutor.especialidad || '—'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTutor(null)}
                aria-label="Cerrar"
                className="rounded-md px-2 py-1 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                ×
              </button>
            </header>

            <div className="p-5">
              {selectedTutor.cv_pdf_url ? (
                <PdfViewer pdfUrl={resolveTutorCvUrl(selectedTutor.cv_pdf_url)} />
              ) : (
                <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                  No se encontró un archivo PDF de CV para esta solicitud.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}