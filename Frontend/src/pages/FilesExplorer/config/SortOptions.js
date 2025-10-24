// Define la lógica de comparación una sola vez.
const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

const Sorter = {
  'name-asc': {
    label: 'Nombre A → Z',
    fn: (a, b) => collator.compare(a.name, b.name)
  },
  'name-desc': {
    label: 'Nombre Z → A',
    fn: (a, b) => collator.compare(b.name, a.name)
  },
  'date-desc': {
    label: 'Fecha (más reciente)',
    // Convertir fechas a strings ISO o timestamps para comparar de forma segura
    fn: (a, b) => new Date(b.date) - new Date(a.date) 
  },
  'date-asc': {
    label: 'Fecha (más antigua)',
    fn: (a, b) => new Date(a.date) - new Date(b.date)
  },
  'size-desc': {
    label: 'Tamaño (mayor)',
    fn: (a, b) => Number(b.size) - Number(a.size)
  },
  'size-asc': {
    label: 'Tamaño (menor)',
    fn: (a, b) => Number(a.size) - Number(a.size)
  },
};

export const SORT_OPTIONS_CONFIG = Sorter;

// Exportamos también un array de las claves y etiquetas para el dropdown
export const SORT_OPTIONS_LIST = Object.entries(Sorter).map(([value, { label }]) => ({
  value,
  label
}));

// Exportamos la clave de la opción por defecto
export const DEFAULT_SORT_OPTION = 'name-asc';