# Documento de Requerimientos de Software (SRS)
## Proyecto: RBE (Riesgos Biológicos Ecuador)

**Fecha de Creación:** Marzo 2026
**Público Objetivo:** Estudiantes, investigadores y profesionales de ciencias biomédicas.

---

## 1. Descripción General del Producto
RBE (Riesgos Biológicos Ecuador) es una plataforma web responsiva diseñada para centralizar, visualizar y analizar datos epidemiológicos, demográficos y de riesgos biológicos a nivel nacional. La herramienta integra visualización geoespacial interactiva con capacidades de visión artificial para la identificación de especies que representan amenazas biológicas o ecológicas.

## 2. Pila Tecnológica (Tech Stack)
* **Backend:** Python con framework **FastAPI** (recomendado para alto rendimiento y manejo asíncrono de modelos de IA).
* **Frontend:** JavaScript (ES6+) con la librería **React.js** bajo el framework **Next.js**.
* **Visualización Geoespacial:** Leaflet.js.
* **Visualización de Datos (Gráficos):** Recharts.
* **Estilos:** CSS (pudiendo integrar módulos de CSS o TailwindCSS para agilizar el diseño responsivo).
* **Plataforma:** Web App (Responsive/Mobile-First) accesible desde navegadores de escritorio y dispositivos móviles.

## 3. Arquitectura de la Base de Datos
La base de datos estará estructurada en los siguientes dominios principales:
1.  **Datos Territoriales:** Almacenamiento de coordenadas, polígonos y límites geográficos de las provincias y ciudades del Ecuador.
2.  **Indicadores Bio-Demográficos:** Registros actualizables de población, tasas de natalidad, tasas de mortalidad y factores ambientales (como la altitud).
3.  **Repositorio de Riesgos y Epidemiología:** Trazabilidad histórica de amenazas biológicas, estadísticas hospitalarias (promedio de pacientes) y series de tiempo para comparaciones.
4.  **Catálogo de Especies:** Registro técnico de flora y fauna, incluyendo indicadores de impacto ecológico, peligrosidad (directa o como especie invasora) y georreferenciación.
*Nota de Integridad:* Todos los registros incluirán metadatos de "Validación de Origen" y "Persistencia Histórica".

## 4. Módulos del Sistema

### 4.1. Módulo de Visualización Geoespacial (Mapa Interactivo)
* Despliegue de un mapa interactivo del Ecuador utilizando Leaflet.js.
* **Funcionalidad *Hover*:** Al posicionar el cursor sobre una ciudad o región, se desplegará un *tooltip* o tarjeta flotante con información demográfica general: altura, número de habitantes, tasa de natalidad y tasa de mortalidad.
* **Funcionalidad *On-Click*:** Al hacer clic en una ubicación, se abrirá un panel detallado (modal o pestaña lateral).

### 4.2. Módulo Epidemiológico y de Riesgos
* Se activa al interactuar con una región específica en el mapa.
* Muestra información de infraestructura (cantidad de hospitales, promedio de pacientes diarios).
* **Enfoque Principal:** Despliegue de los riesgos biológicos específicos de la zona, detallando:
    * Causas y consecuencias.
    * Datos demográficos de las poblaciones más afectadas.
    * Visualización de datos comparativos históricos mediante gráficos (utilizando Recharts).

### 4.3. Módulo de Inteligencia Biológica (Visión Artificial)
* Interfaz para cargar imágenes (mediante captura de pantalla en escritorio o uso de la cámara del celular).
* Procesamiento de la imagen para identificar especies (plantas o insectos).
* Retorno de información básica de la especie identificada.
* Sistema de alertas visuales que resalte si la especie representa un peligro para la población (toxicidad, transmisión de vectores) o si es una especie invasora que afecta a la biodiversidad local.

### 4.4. Módulo de Gestión de Fuentes y Validación
* Toda la información estadística, epidemiológica y biológica mostrada en la plataforma debe estar vinculada a una fuente de datos estructurada.
* Sistema de metadatos que asegure que la información ha sido previamente confirmada y validada.
* Visualización pública y permanente en la interfaz (UI) de la **fecha y hora de la última actualización** de los datos mostrados.

### 4.5. Módulo de Colaboración Institucional
* Arquitectura preparada para la integración de datos provenientes de centros de investigación y hospitales colaboradores.
* Endpoints seguros en la API (Backend) para permitir la ingesta y actualización constante de cifras por parte de estas entidades autorizadas.

---
*Fin del Documento de Requerimientos.*