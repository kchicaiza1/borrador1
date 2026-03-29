from datetime import datetime

from pydantic import BaseModel, Field


class ProvinceSummary(BaseModel):
    id: int
    name: str
    region: str
    latitude: float
    longitude: float
    altitude_m: int
    population: int
    birth_rate: float
    death_rate: float
    last_sync_at: datetime | None = None
    source_type: str = "manual"


class RiskDetail(BaseModel):
    risk_name: str
    causes: str
    consequences: str
    affected_population: str
    hospitals_count: int
    avg_daily_patients: int | None
    epidemiological_fallback: str
    source_name: str
    source_url: str
    validation_status: str
    updated_at: datetime
    source_type: str = "manual"


class ProvinceDetail(ProvinceSummary):
    risks: list[RiskDetail]


class InferenceResponse(BaseModel):
    common_name: str
    scientific_name: str
    risk_category: str
    health_impact: str
    ecosystem_impact: str
    reference_image_url: str
    direct_danger: bool
    alert_message: str = Field(
        description="Mensaje de alerta si la especie representa peligro relevante."
    )


class AdminSyncResponse(BaseModel):
    status: str
    synced_count: int | None = None
    synced_records: int | None = None
