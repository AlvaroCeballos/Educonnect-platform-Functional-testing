// frontend/src/components/AdvancedFilters.jsx
import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AdvancedFilters({ onFilter, onReset }) {
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({
    materia: '',
    minExp: 0,
    genero: '',
    minEdad: 18,
    maxEdad: 70,
    universidad: '',
  });

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.get('/tutors/subjects-catalog');
        setSubjects(res.data || []);
      } catch (err) {
        console.error('Error al cargar materias:', err);
      }
    };
    fetchCatalog();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      materia: '',
      minExp: 0,
      genero: '',
      minEdad: 18,
      maxEdad: 70,
      universidad: '',
    };
    setFilters(emptyFilters);
    onReset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-8 space-y-4"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-emerald-700 font-bold text-base">🔍</span>
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
            Búsqueda Avanzada de Tutores
          </h3>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Filtro 1: Materia */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Materia
          </label>
          <select
            name="materia"
            value={filters.materia}
            onChange={handleChange}
            className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-600 outline-none"
          >
            <option value="">Todas las materias</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.nombre}>
                {sub.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro 2: Sexo / Género */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Género
          </label>
          <select
            name="genero"
            value={filters.genero}
            onChange={handleChange}
            className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-600 outline-none"
          >
            <option value="">Cualquier género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        {/* Filtro 3: Universidad */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Universidad de Graduación
          </label>
          <input
            type="text"
            name="universidad"
            placeholder="Ej. USAC, Landívar..."
            value={filters.universidad}
            onChange={handleChange}
            className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>

        {/* Filtro 4: Experiencia Mínima (Slider interactivo) */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            <span>Experiencia Mínima</span>
            <span className="text-emerald-700 font-extrabold">{filters.minExp} años</span>
          </div>
          <input
            type="range"
            name="minExp"
            min="0"
            max="25"
            value={filters.minExp}
            onChange={handleChange}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* Filtro 5: Rango de Edad */}
        <div className="sm:col-span-2 lg:col-span-2 flex flex-col justify-center">
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            <span>Rango de Edad</span>
            <span className="text-emerald-700 font-extrabold">
              {filters.minEdad} - {filters.maxEdad} años
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              name="minEdad"
              min="18"
              max={filters.maxEdad}
              value={filters.minEdad}
              onChange={handleChange}
              className="w-20 text-xs sm:text-sm border border-slate-300 rounded-lg p-2 text-center bg-slate-50"
            />
            <span className="text-xs text-slate-400 font-semibold">hasta</span>
            <input
              type="number"
              name="maxEdad"
              min={filters.minEdad}
              max="90"
              value={filters.maxEdad}
              onChange={handleChange}
              className="w-20 text-xs sm:text-sm border border-slate-300 rounded-lg p-2 text-center bg-slate-50"
            />
            <button
              type="submit"
              className="flex-1 ml-auto bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-lg transition-all shadow-sm active:scale-95"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}