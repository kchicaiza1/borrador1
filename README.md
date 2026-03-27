# RBE MVP (FastAPI + Next.js + PostgreSQL)

MVP 2 para Riesgos Biologicos Ecuador con:

- mapa 2D interactivo con seleccion provincial,
- vista epidemiologica y de riesgos,
- fuentes validadas con trazabilidad de actualizacion,
- modulo de inteligencia biologica en modo demo local.

## Requisitos previos

- Python 3.11+
- Node.js 20+ y npm
- PostgreSQL 15+ en `localhost:5432`
- (Opcional recomendado) extension PostGIS instalada en PostgreSQL

## Estructura

- `backend/`: API FastAPI modular y scripts de inicializacion
- `backend/sql/`: esquema SQL inicial y datos semilla
- `frontend/`: aplicacion Next.js + Tailwind + Leaflet
- `avance.md`: bitacora de desarrollo y validaciones

## 1) Backend - entorno virtual (Windows)

Desde la raiz del proyecto:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Si PowerShell bloquea scripts:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

## 2) Variables de entorno backend

Crear `backend/.env` tomando como base `backend/.env.example`.

Ejemplo:

```env
APP_NAME=RBE API
APP_ENV=development
API_V1_PREFIX=/api/v1
FRONTEND_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql+asyncpg://postgres:yey62185@localhost:5432/rbe_db
```

## 3) Inicializar base de datos local

Crear base vacia (si aun no existe):

```sql
CREATE DATABASE rbe_db;
```

Opcion A (recomendada para este MVP): inicializar por ORM + seed demo:

```powershell
cd backend
python -m scripts.init_db
```

Opcion B (alternativa): aplicar SQL directamente (incluye `CREATE EXTENSION postgis`):

```powershell
cd backend
psql -U postgres -d rbe_db -f .\sql\001_schema.sql
psql -U postgres -d rbe_db -f .\sql\002_seed.sql
```

## 4) Levantar backend

```powershell
cd backend
uvicorn app.main:app --reload --port 8000
```

Endpoints clave:

- `GET http://localhost:8000/api/v1/health`
- `GET http://localhost:8000/api/v1/regions/provinces`
- `GET http://localhost:8000/api/v1/regions/provinces/{id}`
- `POST http://localhost:8000/api/v1/intelligence/analyze` (form-data con campo `image`)

## 5) Frontend - instalacion y arranque

En otra terminal:

```powershell
cd frontend
npm install
```

Crear `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Ejecutar frontend:

```powershell
cd frontend
npm run dev
```

Abrir: `http://localhost:3000`

## 6) Flujo diario recomendado

1. Activar venv backend:
   - `cd backend`
   - `.\.venv\Scripts\Activate.ps1`
2. Levantar API:
   - `uvicorn app.main:app --reload --port 8000`
3. Levantar frontend en otra terminal:
   - `cd frontend`
   - `npm run dev`
4. Verificar smoke basico:
   - seleccionar provincia en mapa,
   - revisar detalle de riesgos y fuentes,
   - subir imagen para clasificacion demo.

## Notas

- Si PostgreSQL no esta disponible, el frontend no podra cargar datos de provincias.
- `backend/sql/001_schema.sql` incluye preparacion para PostGIS (`CREATE EXTENSION IF NOT EXISTS postgis`).
