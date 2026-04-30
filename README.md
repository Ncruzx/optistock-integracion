# OptiStock - Gestión de Inventario para Telecomunicaciones

## Descripción
OptiStock es una aplicación para gestionar el inventario de equipos en el sector de telecomunicaciones. Incluye un backend en FastAPI y un frontend en Next.js.

## Instalación y Ejecución

### Backend (FastAPI)
1. Navega a la carpeta `backend`:
   ```
   cd backend
   ```

2. Instala las dependencias:
   ```
   pip install fastapi sqlmodel uvicorn
   ```

3. Ejecuta el servidor:
   ```
   python main.py
   ```
   El backend estará disponible en `http://localhost:8000`.

### Frontend (Next.js)
1. Navega a la carpeta `frontend`:
   ```
   cd frontend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Ejecuta el servidor de desarrollo:
   ```
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:3000`.

## Uso
- Accede a la landing page en `http://localhost:3000`.
- Haz clic en "Ir al Dashboard" para ver el panel de control.
- El dashboard muestra estadísticas y la tabla de inventario.

## API Endpoints
- `GET /equipos`: Lista todos los equipos.
- `POST /equipos`: Crea un nuevo equipo.
- `GET /stats`: Obtiene estadísticas del inventario.