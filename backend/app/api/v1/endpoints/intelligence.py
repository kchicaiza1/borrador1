from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.domain_repository import DomainRepository
from app.schemas.domain import InferenceResponse
from app.services.classifier_service import ClassifierService

router = APIRouter(prefix="/intelligence", tags=["intelligence"])
repo = DomainRepository()
classifier = ClassifierService()


@router.post("/analyze", response_model=InferenceResponse)
async def analyze_species(
    image: UploadFile = File(...), db: AsyncSession = Depends(get_db)
) -> InferenceResponse:
    if not image.filename:
        raise HTTPException(status_code=400, detail="Archivo invalido")

    catalog = await repo.get_all_species(db)
    if not catalog:
        raise HTTPException(status_code=500, detail="Catalogo de especies vacio")

    # Read image data
    contents = await image.read()
    species = await classifier.classify_image(contents, catalog)
    return InferenceResponse(
        common_name=species.common_name,
        scientific_name=species.scientific_name,
        risk_category=species.risk_category,
        health_impact=species.health_impact,
        ecosystem_impact=species.ecosystem_impact,
        reference_image_url=species.reference_image_url,
        direct_danger=species.direct_danger.lower() == "yes",
        alert_message=classifier.build_alert(species),
    )
