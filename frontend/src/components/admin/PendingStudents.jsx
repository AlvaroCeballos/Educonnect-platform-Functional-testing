import { useEffect, useState } from 'react';
import api from '../../utils/api';
import PdfViewer from '../PdfViewer';

const resolveDocumentUrl = (documentUrl) => {
  if (!documentUrl) return '';
  if (/^https?:\/\//i.test(documentUrl)) return documentUrl;

  const backendOrigin = `${window.location.protocol}//${window.location.hostname}:5000`;
  const normalizedPath = documentUrl.startsWith('/')
    ? documentUrl
    : `/uploads/${documentUrl}`;

  return `${backendOrigin}${normalizedPath}`;
};

export default function PendingStudents() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPendingStudents = async () => {
      try {
        const response = await api.get('/admin/students/pending');
        if (isMounted) setStudents(response.data.students || []);
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message
              || 'No fue posible cargar los estudiantes pendientes.',
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPendingStudents();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDecision = async (status) => {
    if (!selectedStudent || submitting) return;

    setSubmitting(true);
    setError('');
    try {
      await api.put(`/admin/students/${selectedStudent.id}/status`, { status });
      setStudents((currentStudents) => currentStudents.filter(
        (student) => student.id !== selectedStudent.id,
      ));
      setSelectedStudent(null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || 'No fue posible actualizar el estado del estudiante.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const pdfUrl = resolveDocumentUrl(selectedStudent?.carnet_pdf_url);

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Estudiantes pendientes de aprobación
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Revisa el carnet PDF antes de aprobar o rechazar cada solicitud.
          </p>
        </header>

        {error && (
          <p role="alert" className="mx-5 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="p-5 text-sm text-slate-600">Cargando solicitudes…</p>
        ) : students.length === 0 ? (
          <p className="p-5 text-sm text-slate-600">
            No hay estudiantes pendientes de aprobación.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3">Estudiante</th>
                  <th scope="col" className="px-5 py-3">Carnet</th>
                  <th scope="col" className="px-5 py-3">Correo</th>
                  <th scope="col" className="px-5 py-3">Solicitud</th>
                  <th scope="col" className="px-5 py-3">Documento</th>
                  <th scope="col" className="px-5 py-3">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="text-slate-700">
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {[student.nombre, student.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                    </td>
                    <td className="px-5 py-4 font-mono">{student.carnet || '—'}</td>
                    <td className="px-5 py-4">{student.email}</td>
                    <td className="px-5 py-4">
                      {student.created_at ? new Date(student.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      {student.carnet_pdf_url ? 'PDF disponible' : 'Sin PDF'}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(student)}
                        className="rounded-lg bg-emerald-700 px-3 py-2 font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                      >
                        Revisar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !submitting) setSelectedStudent(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-review-title"
            className="my-auto w-full max-w-4xl rounded-xl bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 id="student-review-title" className="text-lg font-semibold text-slate-900">
                  Revisar estudiante
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {[selectedStudent.nombre, selectedStudent.apellido].filter(Boolean).join(' ')}
                  {' · Carnet: '}{selectedStudent.carnet || '—'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                disabled={submitting}
                aria-label="Cerrar"
                className="rounded-md px-2 py-1 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
              >
                ×
              </button>
            </header>

            <div className="p-5">
              {pdfUrl ? (
                <PdfViewer pdfUrl={pdfUrl} />
              ) : (
                <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                  No se encontró un PDF del carnet para esta solicitud.
                </p>
              )}
              {error && (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
            </div>

            <footer className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => handleDecision('REJECTED')}
                disabled={submitting}
                className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Procesando…' : 'Rechazar'}
              </button>
              <button
                type="button"
                onClick={() => handleDecision('APPROVED')}
                disabled={submitting}
                className="rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Procesando…' : 'Aceptar'}
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
