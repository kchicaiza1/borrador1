import asyncio
from datetime import datetime, timezone
import random
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.entities import Province, RiskRecord

class IntegratorService:
    async def sync_inec_data(self, db: AsyncSession):
        """
        Simulates fetching from INEC REST API (JSON).
        Covers all 24 provinces with updated demographic data.
        """
        await asyncio.sleep(1)
        
        # Real-world approximate data for demo
        provinces_data = [
            ("Pichincha", 3228500), ("Guayas", 4391200), ("Azuay", 881500),
            ("Manabí", 1562000), ("Los Ríos", 921000), ("El Oro", 715000),
            ("Esmeraldas", 643000), ("Tungurahua", 585000), ("Chimborazo", 524000),
            ("Loja", 511000), ("Cotopaxi", 488000), ("Imbabura", 476000),
            ("Santo Domingo", 458000), ("Santa Elena", 401000), ("Cañar", 281000),
            ("Sucumbíos", 230000), ("Bolívar", 209000), ("Morona Santiago", 196000),
            ("Carchi", 186000), ("Orellana", 161000), ("Napo", 133000),
            ("Zamora Chinchipe", 120000), ("Pastaza", 114000), ("Galápagos", 33000)
        ]
        
        updated_count = 0
        for name, pop in provinces_data:
            result = await db.execute(select(Province).where(Province.name == name))
            province = result.scalar_one_or_none()
            if province:
                province.population = pop + random.randint(-1000, 1000) # Small variance
                province.last_sync_at = datetime.now(tz=timezone.utc)
                province.source_type = "sync"
                updated_count += 1
        
        await db.commit()
        return {"status": "success", "synced_count": updated_count}

    async def sync_msp_data(self, db: AsyncSession):
        """
        Simulates fetching clinical epidemiological alerts from MSP.
        """
        await asyncio.sleep(1)
        
        risks = [
            ("Guayas", "Dengue Hemorragico", "Lluvias intensas", "Emergencia sanitaria local"),
            ("Pichincha", "Influenza H1N1", "Temporada invernal", "Alerta en centros educativos"),
            ("Manabí", "Leptospirosis", "Aguas estancadas", "Vigilancia en zonas rurales"),
            ("Galápagos", "Especies Invasoras", "Turismo y transporte", "Riesgo de extincion especies nativas")
        ]
        
        synced = 0
        for prov_name, risk_name, causes, cons in risks:
            res = await db.execute(select(Province).where(Province.name == prov_name))
            province = res.scalar_one_or_none()
            if province:
                # Upsert risk record
                res_risk = await db.execute(
                    select(RiskRecord).where(
                        RiskRecord.province_id == province.id, 
                        RiskRecord.risk_name == risk_name
                    )
                )
                risk = res_risk.scalar_one_or_none()
                if not risk:
                    risk = RiskRecord(
                        province_id=province.id,
                        risk_name=risk_name,
                        causes=causes,
                        consequences=cons,
                        affected_population="Poblacion General",
                        hospitals_count=random.randint(5, 40),
                        avg_daily_patients=random.randint(20, 150),
                        epidemiological_fallback="Actualizado por MSP",
                        source_name="MSP Ecuador",
                        source_url="https://salud.gob.ec",
                        source_type="sync"
                    )
                    db.add(risk)
                else:
                    risk.updated_at = datetime.now(tz=timezone.utc)
                synced += 1
        
        await db.commit()
        return {"status": "success", "synced_records": synced}

    async def sync_inamhi_data(self, db: AsyncSession):
        """
        Simulates fetching climate data from INAMHI to predict biological risks.
        """
        await asyncio.sleep(1)
        
        # Simulate high rainfall in Amazonia and Coast
        regions_risk = {
            "Costa": ("Proliferacion de Vectores (Mosquitos)", "Inundaciones y humedad alta"),
            "Amazonía": ("Enfermedades tropicales", "Humedad extrema y calor"),
            "Sierra": ("Enfermedades respiratorias", "Descenso de temperatura")
        }
        
        updated = 0
        res_prov = await db.execute(select(Province))
        all_provinces = res_prov.scalars().all()
        
        for province in all_provinces:
            if province.region in regions_risk:
                risk_name, cause = regions_risk[province.region]
                
                # Check if risk already exists
                res_risk = await db.execute(
                    select(RiskRecord).where(
                        RiskRecord.province_id == province.id,
                        RiskRecord.risk_name == risk_name
                    )
                )
                risk = res_risk.scalar_one_or_none()
                
                if not risk:
                    new_risk = RiskRecord(
                        province_id=province.id,
                        risk_name=risk_name,
                        causes=cause,
                        consequences="Vigilancia activa por condiciones climaticas.",
                        affected_population="Habitantes de zonas bajas",
                        hospitals_count=0,
                        avg_daily_patients=None,
                        epidemiological_fallback="Prediccion basada en INAMHI",
                        source_name="INAMHI Climate Data",
                        source_url="https://inamhi.gob.ec",
                        source_type="sync"
                    )
                    db.add(new_risk)
                else:
                    risk.updated_at = datetime.now(tz=timezone.utc)
                updated += 1
                
        await db.commit()
        return {"status": "success", "synced_records": updated}
