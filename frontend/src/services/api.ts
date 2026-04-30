const API_BASE = "http://127.0.0.1:8000";

export const getEquipos = async () => {
  const res = await fetch(`${API_BASE}/equipos`);
  return res.json();
};

export const createEquipo = async (equipo) => {
  const res = await fetch(`${API_BASE}/equipos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipo),
  });
  return res.json();
};

export const updateEquipo = async (id: number, equipo: Partial<Equipo>) => {
  const res = await fetch(`${API_BASE}/equipos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipo),
  });
  return res.json();
};

export const deleteEquipo = async (id: number) => {
  const res = await fetch(`${API_BASE}/equipos/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

export const getStats = async () => {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
};