# Documento de Requerimientos de Software (SRS)
## Proyecto: RBE (Riesgos Biológicos Ecuador)

---

### 1. Descripción General del Proyecto
**RBE (Riesgos Biológicos Ecuador)** es una aplicación web y móvil (diseño responsivo) dirigida principalmente a estudiantes de ciencias biomédicas. Su objetivo es centralizar, visualizar y analizar información geoespacial, epidemiológica y biológica del Ecuador mediante mapas interactivos, bases de datos validadas y herramientas de visión artificial.

### 2. Arquitectura y Tecnologías (Stack Tecnológico)
* **Frontend (Cliente):** Next.js (React) con diseño responsivo (Web y Móvil). *Sugerencia de UI:* Tailwind CSS.
* **Backend (Servidor):** Python. *Framework sugerido:* FastAPI (por su rendimiento y manejo de API REST/Visión Artificial) o Django (por su panel de administración robusto).
* **Base de Datos:** PostgreSQL (con extensión PostGIS recomendada para manejo de datos geoespaciales).
* **Librería de Mapas:** Leaflet.js.

### 3. Módulos del Sistema y Requerimientos Funcionales

#### 3.1. Módulo de Visualización Geoespacial (Mapa Interactivo)
* **RF-1.1:** El sistema debe mostrar un mapa 2D del Ecuador utilizando Leaflet.js.
* **RF-1.2:** Al pasar el cursor (hover) sobre una provincia, se debe mostrar un tooltip/tarjeta con información general: altura, número de habitantes, tasa de natalidad y tasa de mortalidad.
* **RF-1.3:** Al posicionar el cursor fuera de los límites del mapa del Ecuador, el sistema debe permitir al usuario seleccionar una región específica a través de un menú emergente o panel lateral.
* **RF-1.4:** Al hacer clic en una provincia o región, la interfaz debe recargar la vista de detalle con la información profunda del área seleccionada.

#### 3.2. Módulo Epidemiológico y de Riesgos (Vista de Detalle)
* **RF-2.1:** Despliegue de riesgos biológicos principales del área seleccionada, incluyendo causas y consecuencias.
* **RF-2.2:** Visualización de poblaciones más afectadas con gráficos/cifras comparativas a lo largo del tiempo.
* **RF-2.3:** Visualización de infraestructura de salud: cantidad de hospitales y promedio de pacientes diarios.
* **RF-2.4:** En caso de no existir datos de pacientes diarios, el sistema mostrará como contingencia la "Situación Epidemiológica" semanal o mensual del MSP.

#### 3.3. Módulo de Inteligencia Biológica (Visión Artificial)
* **RF-3.1:** El sistema debe permitir el acceso a la cámara del dispositivo o la carga de una captura de pantalla/imagen.
* **RF-3.2:** El sistema analizará la imagen de una planta o insecto y devolverá su información organizada en:
    1.  Nombre científico y común.
    2.  Categoría de Riesgo (Invasora, Venenosa, Portadora de parásitos).
    3.  Impacto en Salud.
    4.  Imágenes de referencia.
* **RF-3.3:** Se debe resaltar visualmente (alertas) si la especie representa un peligro directo para la población o si es una especie invasora y cómo afecta el ecosistema local.

#### 3.4. Módulo de Gestión de Fuentes y Validación
* **RF-4.1:** Todo dato mostrado en la plataforma debe incluir un enlace o referencia a su fuente validada.
* **RF-4.2:** El sistema debe mostrar la fecha y hora de la última actualización de los datos (actualización programada mensualmente).
* **RF-4.3:** Panel administrativo (Backend) para gestionar, aprobar y validar las fuentes de información antes de ser publicadas en el Frontend.

#### 3.5. Módulo de Colaboración Institucional (Fuentes de Datos)
* **RF-5.1:** Integración o importación de datos provenientes de instituciones preaprobadas:
    * *Salud y Población:* INEC, Ministerio de Salud Pública (MSP - Geovisor, Boletines), Geosalud.
    * *Ecosistemas y Especies:* Repositorios Universitarios, Fundación Charles Darwin, MAATE, INABIO.

### 4. Requerimientos de Base de Datos (PostgreSQL)

La base de datos estará estructurada bajo los siguientes pilares:

1.  **Datos Territoriales:** División político-administrativa (provincias, cantones, parroquias) basada en códigos oficiales del INEC. Clasificación por pisos climáticos, regiones naturales y ecosistemas dominantes.
2.  **Indicadores Bio-Demográficos:** Registros de población, tasas de natalidad/mortalidad y factores ambientales (altitud).
3.  **Repositorio de Riesgos y Epidemiología:** Tablas históricas de amenazas biológicas, trazabilidad epidemiológica y estadísticas de infraestructura hospitalaria.
4.  **Catálogo de Especies:** Registro de flora y fauna con indicadores de impacto ecológico, peligrosidad (venenosa, invasora, parásita), georreferenciación, y persistencia histórica.
5.  **Metadatos y Validación:** Tablas de auditoría que almacenen el origen de la información, el estado de validación y la fecha de la última actualización.

### 5. Requerimientos No Funcionales
* **RNF-1 (Usabilidad):** La interfaz debe ser intuitiva ("simple"), orientada a un usuario académico sin necesidad de conocimientos previos en software GIS.
* **RNF-2 (Disponibilidad):** La plataforma web debe ser accesible desde navegadores modernos de escritorio y dispositivos móviles (Responsive Web Design).
* **RNF-3 (Rendimiento):** La carga del mapa base y los polígonos provinciales debe realizarse en menos de 3 segundos con conexiones estándar.
* **RNF-4 (Privacidad):** El uso de la cámara para el Módulo de Inteligencia Biológica requerirá los permisos explícitos del usuario en el navegador/dispositivo y las fotos no deben almacenarse sin consentimiento.