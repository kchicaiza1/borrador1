# Avance del Proyecto RBE

## Estado general
- Fecha: 2026-03-27
- Fase actual: MVP 2 (implementacion base)
- Estado: En progreso

## Resumen del MVP (alcance actual)
- **Backend**: FastAPI + SQLAlchemy async + PostgreSQL.
  - Endpoints:
    - `GET /api/v1/health`
    - `GET /api/v1/regions/provinces`
    - `GET /api/v1/regions/provinces/{id}`
    - `POST /api/v1/intelligence/analyze`
- **BD**: esquema demo + seeds (provincias, riesgos, especies, fuentes).
- **Frontend**: Next.js + Tailwind + Leaflet (mapa con marcadores; click para detalle; demo de analisis de imagen).

## Bitacora
### 2026-03-26
- Implementado MVP base (backend + BD + frontend).
- Documentacion inicial para ejecutar localmente.

### 2026-03-27
- Restaurados artefactos de la app en el working tree: `backend/`, `frontend/` y `avance.md`.
- `README.md` unificado (sin duplicados) y alineado con el codigo real:
  - VENV en `backend/.venv`
  - frontend usa `NEXT_PUBLIC_API_URL`
  - inicializacion recomendada: `cd backend` -> `python -m scripts.init_db`

## Pendiente inmediato (validacion local E2E)
- Crear BD si no existe: `CREATE DATABASE rbe_db;`
- Inicializar tablas/seeds:
  - Opcion A: `cd backend` -> `python -m scripts.init_db`
  - Opcion B: `cd backend` -> `psql -U postgres -d rbe_db -f .\sql\001_schema.sql` y `psql -U postgres -d rbe_db -f .\sql\002_seed.sql`
- Levantar servicios:
  - backend: `cd backend` -> `uvicorn app.main:app --reload --port 8000`
  - frontend: `cd frontend` -> `npm install` -> `npm run dev`

## Riesgos/Bloqueos conocidos
- Si PostgreSQL no esta disponible o `rbe_db` no existe, el backend no podra listar provincias.
- PostGIS es opcional para este MVP; el SQL lo habilita si esta instalado.
- El clasificador de vision artificial es demo local basado en nombre de archivo, no un modelo ML real.

