import { useMemo, useState } from 'react';
import api from '../../utils/api';

const initialForm = {
  nombre: '',
  apellido: '',
  carnet: '',
  identificacion: '',
  fecha_nacimiento: '',
  genero: 'UNSPECIFIED',
  email: '',
  password: '',
  confirmPassword: '',
  especialidad: '',
  direccion_tutoria: '',
  anio_inicio_experiencia: '',
  universidad: '',
};

const fields = [
  ['nombre', 'Nombre', 'text'],
  ['apellido', 'Apellido', 'text'],
  ['carnet', 'Carnet', 'text'],
  ['identificacion', 'DPI / identificación', 'text'],
  ['fecha_nacimiento', 'Fecha de nacimiento', 'date'],
  ['email', 'Correo electrónico', 'email'],
  ['especialidad', 'Especialidad o materia', 'text'],
  ['direccion_tutoria', 'Dirección de tutoría', 'text'],
  ['anio_inicio_experiencia', 'Año de inicio de experiencia', 'number'],
  ['universidad', 'Universidad', 'text'],
];

export default function TutorRegistration() {
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [cv, setCv] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const photoPreview = useMemo(
    () => (photo ? URL.createObjectURL(photo) : ''),
    [photo],
  );

  const update = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!photo) {
      setStatus({ type: 'error', message: 'La fotografía es obligatoria.' });
      return;
    }

    if (!cv) {
      setStatus({ type: 'error', message: 'El CV en formato PDF es obligatorio.' });
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)) {
      setStatus({
        type: 'error',
        message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.',
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'confirmPassword') data.append(key, value);
    });
    data.append('fotografia', photo);
    data.append('cv', cv);

    setSubmitting(true);
    try {
      const response = await api.post('/auth/register/tutor', data);
      setStatus({ type: 'success', message: response.data.message });
      setForm(initialForm);
      setPhoto(null);
      setCv(null);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'No fue posible completar el registro.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="intro-panel">
        <span className="brand-mark">E</span>
        <p className="eyebrow">EDUCONNECT</p>
        <h1>Comparte lo que sabes. Impulsa a quien aprende.</h1>
        <p className="intro-copy">
          Crea tu perfil profesional y forma parte de nuestra comunidad de tutores.
        </p>
      </section>

      <section className="form-panel">
        <div className="form-heading">
          <p className="eyebrow">REGISTRO DE TUTOR</p>
          <h2>Crea tu cuenta profesional</h2>
          <p>Todos los campos son obligatorios.</p>
        </div>

        <form onSubmit={submit}>
          <div className="photo-row">
            <label className="photo-picker">
              {photoPreview ? <img src={photoPreview} alt="Vista previa" /> : <span>Agregar foto</span>}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setPhoto(event.target.files?.[0] || null)}
                required
              />
            </label>
            <div>
              <strong>Fotografía profesional</strong>
              <p>JPG, PNG o WEBP. Máximo 5 MB.</p>
            </div>
          </div>

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              CV en formato PDF
            </span>
            <input
              name="cv"
              type="file"
              accept="application/pdf"
              required
              onChange={(event) => setCv(event.target.files?.[0] || null)}
              className="block w-full rounded-lg border border-slate-300 p-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-medium"
            />
            <span className="mt-1 block text-xs text-slate-500">PDF. Máximo 5 MB.</span>
          </label>

          <div className="field-grid">
            {fields.map(([name, label, type]) => (
              <label key={name} className={name === 'direccion_tutoria' ? 'wide' : ''}>
                <span>{label}</span>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={update}
                  required
                />
              </label>
            ))}

            <label>
              <span>Género</span>
              <select name="genero" value={form.genero} onChange={update}>
                <option value="UNSPECIFIED">Prefiero no indicar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="OTHER">Otro</option>
              </select>
            </label>

            <label>
              <span>Contraseña</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={update}
                required
              />
            </label>

            <label>
              <span>Confirmar contraseña</span>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={update}
                required
              />
            </label>
          </div>

          {status.message && <div className={`feedback ${status.type}`}>{status.message}</div>}

          <button className="submit-button" type="submit" disabled={submitting}>
            {submitting ? 'Enviando solicitud…' : 'Enviar solicitud de registro'}
          </button>
        </form>
      </section>
    </main>
  );
}
