from datetime import datetime, timezone

from sqlalchemy import delete

from app.core.database import SessionLocal
from app.models.entities import Province, RiskRecord, Species


async def seed_data() -> None:
    async with SessionLocal() as db:
        await db.execute(delete(RiskRecord))
        await db.execute(delete(Species))
        await db.execute(delete(Province))
        await db.commit()

        provinces = [
            Province(name="Pichincha", region="Sierra", latitude=-0.1807, longitude=-78.4678, altitude_m=2850, population=3228000, birth_rate=13.2, death_rate=5.7),
            Province(name="Guayas", region="Costa", latitude=-2.1894, longitude=-79.8891, altitude_m=4, population=4301000, birth_rate=14.1, death_rate=6.0),
            Province(name="Azuay", region="Sierra", latitude=-2.9001, longitude=-79.0059, altitude_m=2560, population=881394, birth_rate=11.8, death_rate=5.2),
            Province(name="Bolívar", region="Sierra", latitude=-1.5917, longitude=-79.0022, altitude_m=2668, population=209933, birth_rate=12.5, death_rate=5.5),
            Province(name="Cañar", region="Sierra", latitude=-2.7397, longitude=-78.8486, altitude_m=2518, population=281396, birth_rate=12.0, death_rate=5.3),
            Province(name="Carchi", region="Sierra", latitude=0.8119, longitude=-77.7173, altitude_m=2980, population=186869, birth_rate=11.5, death_rate=5.1),
            Province(name="Chimborazo", region="Sierra", latitude=-1.6709, longitude=-78.6473, altitude_m=2750, population=524004, birth_rate=13.0, death_rate=5.8),
            Province(name="Cotopaxi", region="Sierra", latitude=-0.9314, longitude=-78.6041, altitude_m=2800, population=488716, birth_rate=13.5, death_rate=5.9),
            Province(name="El Oro", region="Costa", latitude=-3.2581, longitude=-79.9554, altitude_m=6, population=715751, birth_rate=14.5, death_rate=6.2),
            Province(name="Esmeraldas", region="Costa", latitude=0.9682, longitude=-79.6517, altitude_m=15, population=643654, birth_rate=15.0, death_rate=6.5),
            Province(name="Galápagos", region="Insular", latitude=-0.9022, longitude=-89.6115, altitude_m=6, population=33042, birth_rate=10.5, death_rate=4.5),
            Province(name="Imbabura", region="Sierra", latitude=0.3517, longitude=-78.1222, altitude_m=2225, population=476257, birth_rate=12.8, death_rate=5.6),
            Province(name="Loja", region="Sierra", latitude=-3.9931, longitude=-79.2042, altitude_m=2060, population=511184, birth_rate=12.2, death_rate=5.4),
            Province(name="Los Ríos", region="Costa", latitude=-1.8022, longitude=-79.5344, altitude_m=8, population=921763, birth_rate=14.8, death_rate=6.3),
            Province(name="Manabí", region="Costa", latitude=-1.0543, longitude=-80.4539, altitude_m=53, population=1562079, birth_rate=14.3, death_rate=6.1),
            Province(name="Morona Santiago", region="Amazonía", latitude=-2.3087, longitude=-78.1185, altitude_m=1050, population=196534, birth_rate=15.5, death_rate=6.8),
            Province(name="Napo", region="Amazonía", latitude=-0.9938, longitude=-77.8129, altitude_m=510, population=133705, birth_rate=15.2, death_rate=6.7),
            Province(name="Orellana", region="Amazonía", latitude=-0.4664, longitude=-76.9872, altitude_m=255, population=161338, birth_rate=15.8, death_rate=7.0),
            Province(name="Pastaza", region="Amazonía", latitude=-1.4821, longitude=-77.9991, altitude_m=950, population=114202, birth_rate=15.4, death_rate=6.9),
            Province(name="Santa Elena", region="Costa", latitude=-2.2262, longitude=-80.8584, altitude_m=30, population=401178, birth_rate=14.0, death_rate=6.0),
            Province(name="Santo Domingo", region="Costa", latitude=-0.2520, longitude=-79.1714, altitude_m=625, population=458580, birth_rate=14.2, death_rate=6.1),
            Province(name="Sucumbíos", region="Amazonía", latitude=0.0847, longitude=-76.8828, altitude_m=297, population=230503, birth_rate=15.6, death_rate=7.1),
            Province(name="Tungurahua", region="Sierra", latitude=-1.2491, longitude=-78.6272, altitude_m=2580, population=585981, birth_rate=12.6, death_rate=5.5),
            Province(name="Zamora Chinchipe", region="Amazonía", latitude=-4.0692, longitude=-78.9567, altitude_m=920, population=120416, birth_rate=15.3, death_rate=6.8),
        ]
        db.add_all(provinces)
        await db.flush()

        # Adding essential risk records for demo
        risk_records = [
            RiskRecord(
                province_id=provinces[0].id,
                risk_name="Brotes respiratorios estacionales",
                causes="Alta movilidad urbana y cambios climaticos.",
                consequences="Aumento de consultas y ausentismo academico.",
                affected_population="Ninos, adultos mayores y pacientes cronicos.",
                hospitals_count=36,
                avg_daily_patients=980,
                epidemiological_fallback="Boletin MSP semana 11: incremento moderado.",
                source_name="MSP Ecuador",
                source_url="https://www.salud.gob.ec/",
                validation_status="approved",
                updated_at=datetime.now(tz=timezone.utc),
                source_type="sync"
            ),
            RiskRecord(
                province_id=provinces[1].id,
                risk_name="Enfermedades vectoriales (Dengue)",
                causes="Zonas humedas y presencia de criaderos por lluvias.",
                consequences="Mayor presion en emergencias y vigilancia comunitaria.",
                affected_population="Barrios periurbanos y zonas costeras.",
                hospitals_count=41,
                avg_daily_patients=None,
                epidemiological_fallback="Sin dato diario consolidado. Vigilancia activa MSP.",
                source_name="Geosalud",
                source_url="https://geosalud.msp.gob.ec/",
                validation_status="approved",
                updated_at=datetime.now(tz=timezone.utc),
                source_type="sync"
            ),
        ]
        db.add_all(risk_records)

        species = [
            Species(
                common_name="Aedes aegypti",
                scientific_name="Aedes aegypti",
                risk_category="Portadora de parasitos",
                health_impact="Transmision potencial de dengue, zika y chikungunya.",
                ecosystem_impact="Interaccion con ecosistemas urbanos densos.",
                reference_image_url="https://example.com/aedes.jpg",
                direct_danger="yes",
            ),
            Species(
                common_name="Caracol gigante africano",
                scientific_name="Achatina fulica",
                risk_category="Invasora",
                health_impact="Puede alojar parasitos que afectan a humanos.",
                ecosystem_impact="Desplaza especies nativas y afecta cultivos.",
                reference_image_url="https://example.com/achatina.jpg",
                direct_danger="no",
            ),
        ]
        db.add_all(species)
        await db.commit()
