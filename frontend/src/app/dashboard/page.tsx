"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { getEquipos, getStats, createEquipo, updateEquipo, deleteEquipo } from '@/services/api';
import { Server, CheckCircle, AlertTriangle, Search, Edit, Trash, Download, Plus, UserCheck } from 'lucide-react';
import EquipoModal from '@/components/EquipoModal';
import { Toaster, toast } from 'react-hot-toast';

interface Equipo {
  id: number;
  nombre: string;
  marca: string;
  serie: string;
  mac: string;
  estado: string;
  ubicacion: string;
}

interface Stats {
  total: number;
  disponibles: number;
  danados: number;
}

// Seed data
const seedEquipos: Equipo[] = [
  { id: 1, nombre: 'Router Cisco 2901', marca: 'Cisco', serie: 'FCZ123456', mac: '00:1B:44:11:3A:B7', estado: 'Disponible', ubicacion: 'Oficina Central' },
  { id: 2, nombre: 'Switch Mikrotik CRS326', marca: 'Mikrotik', serie: 'MT789012', mac: '4C:5E:0C:22:4A:8B', estado: 'Asignado', ubicacion: 'Sucursal Norte' },
  { id: 3, nombre: 'ONU Huawei HG8245', marca: 'Huawei', serie: 'HW345678', mac: '00:0F:E2:33:5C:9D', estado: 'Dañado', ubicacion: 'Almacén' },
  { id: 4, nombre: 'Access Point Ubiquiti UAP-AC', marca: 'Ubiquiti', serie: 'UB901234', mac: '80:2A:A8:44:6E:EF', estado: 'Disponible', ubicacion: 'Sala de Servidores' },
  { id: 5, nombre: 'Firewall Palo Alto PA-220', marca: 'Palo Alto', serie: 'PA567890', mac: '00:1B:17:55:7F:01', estado: 'Asignado', ubicacion: 'Data Center' },
  { id: 6, nombre: 'Modem DOCSIS Arris TG1682G', marca: 'Arris', serie: 'AR123456', mac: '00:1D:D4:66:8A:23', estado: 'Disponible', ubicacion: 'Oficina Sur' },
  { id: 7, nombre: 'Switch Cisco Catalyst 2960', marca: 'Cisco', serie: 'CS789012', mac: '00:1C:58:77:9B:45', estado: 'Dañado', ubicacion: 'Taller' },
  { id: 8, nombre: 'Router Mikrotik hAP ac', marca: 'Mikrotik', serie: 'MT345678', mac: '4C:5E:0C:88:CA:67', estado: 'Asignado', ubicacion: 'Sucursal Este' },
];

export default function Dashboard() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, disponibles: 0, danados: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingEquipo, setEditingEquipo] = useState<Equipo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = () => {
      if (typeof window !== 'undefined') {
        const sessionActive = localStorage.getItem('optistock_session');
        if (!sessionActive) {
          router.replace('/login');
        }
      }
    };

    checkSession();
  }, [router]);

  const updateStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error updating stats');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const equiposData = await getEquipos();
        setEquipos(equiposData);
        await updateStats();
      } catch (error) {
        toast.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addEquipo = async (equipo: Partial<Equipo>) => {
    try {
      const data = { ...equipo };
      delete data.id; // Asegurar que no se envíe id para crear
      const created = await createEquipo(data);
      setEquipos([...equipos, created]);
      await updateStats();
      toast.success('Equipo agregado exitosamente');
    } catch (error) {
      toast.error('Error al agregar equipo');
    }
  };

  const updateEquipoHandler = async (equipo: Partial<Equipo>) => {
    try {
      if (!equipo.id) {
        throw new Error('ID requerido para actualizar');
      }
      const data = await updateEquipo(equipo.id, equipo as Equipo);
      setEquipos(equipos.map(e => e.id === equipo.id ? data : e));
      await updateStats();
      toast.success('Equipo actualizado');
    } catch (error) {
      toast.error('Error al actualizar equipo');
    }
  };

  const removeEquipo = async (id: number) => {
    try {
      await deleteEquipo(id);
      setEquipos(equipos.filter(e => e.id !== id));
      await updateStats();
      toast.success('Equipo eliminado');
    } catch (error) {
      toast.error('Error al eliminar equipo');
    }
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Marca', 'Serie', 'MAC', 'Estado', 'Ubicación'];
    const rows = filteredEquipos.map(e => [e.nombre, e.marca, e.serie, e.mac, e.estado, e.ubicacion]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventario_equipos.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Reporte exportado');
  };

  const filteredEquipos = equipos.filter(equipo => {
    const matchesSearch = equipo.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipo.mac.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' || equipo.estado === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-slate-100">Panel de Control de Red</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-400">Sistema Online</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('optistock_session');
                router.replace('/login');
              }
            }}
            className="bg-slate-700 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-600 transition-all duration-300"
          >
            Cerrar Sesión
          </button>
          <button
            onClick={() => { setEditingEquipo(null); setIsModalOpen(true); }}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Equipo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {(() => {
        const asignados = equipos.filter(e => e.estado === 'Asignado').length;
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-900/50 border border-slate-800 backdrop-blur p-6 rounded-lg">
              <Server className="w-8 h-8 text-blue-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-200">Total Equipos</h2>
              <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 backdrop-blur p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-200">Disponibles</h2>
              <p className="text-3xl font-bold text-green-400">{stats.disponibles}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 backdrop-blur p-6 rounded-lg">
              <UserCheck className="w-8 h-8 text-amber-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-200">Asignados</h2>
              <p className="text-3xl font-bold text-amber-400">{asignados}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 backdrop-blur p-6 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-200">Dañados</h2>
              <p className="text-3xl font-bold text-red-400">{stats.danados}</p>
            </div>
          </div>
        );
      })()}

      {/* Inventory Table */}
      <div className="bg-slate-900/50 border border-slate-800 backdrop-blur p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-200">Inventario de Equipos</h2>
          <button
            onClick={exportToCSV}
            className="bg-slate-700 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-600 flex items-center gap-2"
          >
            <Download size={16} />
            Exportar Reporte
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['Todos', 'Disponible', 'Asignado', 'Dañado'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por Serie o MAC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <table className="w-full table-auto">
          <thead>
            <tr className="text-slate-400">
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Marca</th>
              <th className="px-4 py-3 text-left">Serie</th>
              <th className="px-4 py-3 text-left">MAC</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Ubicación</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Cargando equipos...
                </td>
              </tr>
            ) : (
              filteredEquipos.map((equipo) => (
                <tr key={equipo.id} className="border-b border-slate-700">
                  <td className="px-4 py-3 text-slate-100">{equipo.nombre}</td>
                  <td className="px-4 py-3 text-slate-100">{equipo.marca}</td>
                  <td className="px-4 py-3 text-slate-100">{equipo.serie}</td>
                  <td className="px-4 py-3 text-slate-100">{equipo.mac}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      equipo.estado === 'Disponible' ? 'bg-green-500/20 text-green-400' :
                      equipo.estado === 'Asignado' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {equipo.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-100">{equipo.ubicacion}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Edit
                        className="w-4 h-4 text-slate-400 cursor-pointer hover:text-blue-400"
                        onClick={() => { setEditingEquipo(equipo); setIsModalOpen(true); }}
                      />
                      <Trash
                        className="w-4 h-4 text-red-400 cursor-pointer hover:text-red-600"
                        onClick={() => removeEquipo(equipo.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EquipoModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEquipo(null); }}
        onSave={(equipo) => {
          if (editingEquipo) {
            updateEquipoHandler(equipo);
          } else {
            addEquipo(equipo);
          }
        }}
        editingEquipo={editingEquipo}
      />
    </div>
  );
}