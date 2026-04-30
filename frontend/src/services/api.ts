interface Equipo {
  id?: number;
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

const API_BASE = "https://optistock-api-e249.onrender.com";

export const getEquipos = async (): Promise<Equipo[]> => {
  const res = await fetch(`${API_BASE}/equipos`);
  return res.json();
};

export const createEquipo = async (equipo: Partial<Equipo>): Promise<Equipo> => {
  const res = await fetch(`${API_BASE}/equipos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipo),
  });
  return res.json();
};

export const updateEquipo = async (id: number, equipo: Partial<Equipo>): Promise<Equipo> => {
  const res = await fetch(`${API_BASE}/equipos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipo),
  });
  return res.json();
};

export const deleteEquipo = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`${API_BASE}/equipos/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

export const getStats = async (): Promise<Stats> => {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
};