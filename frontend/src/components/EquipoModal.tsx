import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Equipo {
  id?: number;
  nombre: string;
  marca: string;
  serie: string;
  mac: string;
  estado: string;
  ubicacion: string;
}

interface EquipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipo: Partial<Equipo>) => void;
  editingEquipo?: Equipo | null;
}

export default function EquipoModal({ isOpen, onClose, onSave, editingEquipo }: EquipoModalProps) {
  const [form, setForm] = useState<Partial<Equipo>>({
    id: undefined,
    nombre: '',
    marca: '',
    serie: '',
    mac: '',
    estado: 'Disponible',
    ubicacion: '',
  });

  useEffect(() => {
    if (editingEquipo) {
      setForm(editingEquipo);
    } else {
      setForm({
        id: undefined,
        nombre: '',
        marca: '',
        serie: '',
        mac: '',
        estado: 'Disponible',
        ubicacion: '',
      });
    }
  }, [editingEquipo, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form };
    if (!editingEquipo) {
      delete data.id;
    }
    onSave(data);
    if (!editingEquipo) {
      setForm({
        id: undefined,
        nombre: '',
        marca: '',
        serie: '',
        mac: '',
        estado: 'Disponible',
        ubicacion: '',
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-100">{editingEquipo ? 'Editar Equipo' : 'Nuevo Equipo'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Marca</label>
            <input
              type="text"
              value={form.marca}
              onChange={(e) => setForm({ ...form, marca: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Serie</label>
            <input
              type="text"
              value={form.serie}
              onChange={(e) => setForm({ ...form, serie: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">MAC</label>
            <input
              type="text"
              value={form.mac}
              onChange={(e) => setForm({ ...form, mac: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Disponible">Disponible</option>
              <option value="Asignado">Asignado</option>
              <option value="Dañado">Dañado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Ubicación</label>
            <input
              type="text"
              value={form.ubicacion}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}