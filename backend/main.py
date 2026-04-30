from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, Session, select
from sqlalchemy import func
from uuid import UUID, uuid4
from enum import Enum
from typing import List, Optional

class EstadoEquipo(str, Enum):
    disponible = "Disponible"
    asignado = "Asignado"
    danado = "Dañado"

class Equipo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    marca: str
    serie: str = Field(unique=True)
    mac: str = Field(unique=True)
    estado: EstadoEquipo
    ubicacion: str

engine = create_engine("sqlite:///database.db")
SQLModel.metadata.drop_all(engine)  # Limpiar esquema anterior
SQLModel.metadata.create_all(engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://optistock-integracion.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API de OptiStock funcionando"}

@app.get("/equipos", response_model=List[Equipo])
def listar_equipos():
    with Session(engine) as session:
        equipos = session.exec(select(Equipo)).all()
        return equipos

@app.post("/equipos", response_model=Equipo)
def crear_equipo(equipo: Equipo):
    with Session(engine) as session:
        session.add(equipo)
        session.commit()
        session.refresh(equipo)
        return equipo

@app.put("/equipos/{equipo_id}", response_model=Equipo)
def actualizar_equipo(equipo_id: int, equipo: Equipo):
    with Session(engine) as session:
        db_equipo = session.get(Equipo, equipo_id)
        if not db_equipo:
            raise HTTPException(status_code=404, detail="Equipo no encontrado")
        for key, value in equipo.dict(exclude_unset=True).items():
            setattr(db_equipo, key, value)
        session.commit()
        session.refresh(db_equipo)
        return db_equipo

@app.delete("/equipos/{equipo_id}")
def eliminar_equipo(equipo_id: int):
    with Session(engine) as session:
        db_equipo = session.get(Equipo, equipo_id)
        if not db_equipo:
            raise HTTPException(status_code=404, detail="Equipo no encontrado")
        session.delete(db_equipo)
        session.commit()
        return {"message": "Equipo eliminado"}

@app.get("/stats")
def get_stats():
    with Session(engine) as session:
        total = session.exec(select(func.count(Equipo.id))).one()
        disponibles = session.exec(select(func.count(Equipo.id)).where(Equipo.estado == EstadoEquipo.disponible)).one()
        danados = session.exec(select(func.count(Equipo.id)).where(Equipo.estado == EstadoEquipo.danado)).one()
        return {"total": total, "disponibles": disponibles, "danados": danados}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)