import { useMemo, useState } from 'react';
import api from './utils/api';

const initialForm = {
  nombre: '', apellido: '', carnet: '', identificacion: '', fecha_nacimiento: '',
  genero: 'UNSPECIFIED', email: '', password: '', confirmPassword: '',
  especialidad: '', direccion_tutoria: '', anio_inicio_experiencia: '', universidad: '',
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

function App() {
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const photoPreview = useMemo(() => (photo ? URL.createObjectURL(photo) : ''), [photo]);

  const updateField = ({ target }) => setForm((current) => ({
    ...current,
    [target.name]: target.value,
  }));

  const validate = () => {
    if (!photo) return 'La fotografía es obligatoria.';
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)) {
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
    }
    if (form.password !== form.confirmPassword) return 'Las contraseñas no coinciden.';
    return '';
  };

  const submit = async (event) => {
    event.preventDefault();
    const validationMessage = validate();
    if (validationMessage) {
      setStatus({ type: 'error', message: validationMessage });
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'confirmPassword') data.append(key, value);
    });
    data.append('fotografia', photo);

    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await api.post('/auth/register/tutor', data);
      setStatus({ type: 'success', message: response.data.message });
      setForm(initialForm);
      setPhoto(null);
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
          Un administrador revisará tu solicitud antes de habilitar tu cuenta.
        </p>
        <div className="status-pill"><span /> Aprobación segura de perfiles</div>
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

          <div className="field-grid">
            {fields.map(([name, label, type]) => (
              <label key={name} className={name === 'direccion_tutoria' ? 'wide' : ''}>
                <span>{label}</span>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={updateField}
                  min={type === 'number' ? '1901' : undefined}
                  max={type === 'number' ? String(new Date().getFullYear()) : undefined}
                  required
                />
              </label>
            ))}

            <label>
              <span>Género</span>
              <select name="genero" value={form.genero} onChange={updateField} required>
                <option value="UNSPECIFIED">Prefiero no indicar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="OTHER">Otro</option>
              </select>
            </label>

            <label>
              <span>Contraseña</span>
              <input name="password" type="password" value={form.password} onChange={updateField} required />
            </label>
            <label>
              <span>Confirmar contraseña</span>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} required />
            </label>
          </div>

          <p className="password-hint">8+ caracteres · mayúscula · minúscula · número</p>
          {status.message && <div className={`feedback ${status.type}`}>{status.message}</div>}
          <button className="submit-button" type="submit" disabled={submitting}>
            {submitting ? 'Enviando solicitud…' : 'Enviar solicitud de registro'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
