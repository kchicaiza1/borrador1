from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.integrator_service import IntegratorService
from app.schemas.domain import AdminSyncResponse, ProvinceSummary

router = APIRouter(prefix="/admin", tags=["admin"])
integrator = IntegratorService()

@router.post("/sync/inec", response_model=AdminSyncResponse)
async def sync_inec(db: AsyncSession = Depends(get_db)):
    """
    Triggers manual sync from INEC.
    """
    try:
        result = await integrator.sync_inec_data(db)
        return AdminSyncResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en sincronizacion INEC: {str(e)}")

@router.post("/sync/msp", response_model=AdminSyncResponse)
async def sync_msp(db: AsyncSession = Depends(get_db)):
    """
    Triggers manual sync from MSP.
    """
    try:
        result = await integrator.sync_msp_data(db)
        return AdminSyncResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en sincronizacion MSP: {str(e)}")

@router.post("/sync/inamhi", response_model=AdminSyncResponse)
async def sync_inamhi(db: AsyncSession = Depends(get_db)):
    """
    Triggers manual sync from INAMHI.
    """
    try:
        result = await integrator.sync_inamhi_data(db)
        return AdminSyncResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en sincronizacion INAMHI: {str(e)}")

@router.get("/stats")
async def get_admin_stats(db: AsyncSession = Depends(get_db)):
    """
    Returns data management statistics.
    """
    # Simple stats for now
    from sqlalchemy import func, select
    from app.models.entities import Province, RiskRecord
    
    total_provinces = await db.scalar(select(func.count(Province.id)))
    total_risks = await db.scalar(select(func.count(RiskRecord.id)))
    
    return {
        "total_provinces": total_provinces,
        "total_risks": total_risks,
        "inec_last_sync": "2026-03-28T18:00:00Z", # Placeholder
        "msp_last_sync": "2026-03-28T18:30:00Z" # Placeholder
    }
