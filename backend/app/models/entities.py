from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Province(Base):
    __tablename__ = "provinces"
    __table_args__ = (
        CheckConstraint("population >= 0", name="ck_provinces_population_positive"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    region: Mapped[str] = mapped_column(String(80), index=True)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    altitude_m: Mapped[int] = mapped_column(Integer)
    population: Mapped[int] = mapped_column(Integer)
    birth_rate: Mapped[float] = mapped_column(Float)
    death_rate: Mapped[float] = mapped_column(Float)
    last_sync_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    source_type: Mapped[str] = mapped_column(String(20), default="manual")  # 'manual' or 'sync'

    risk_records: Mapped[list["RiskRecord"]] = relationship(back_populates="province")


class RiskRecord(Base):
    __tablename__ = "risk_records"
    __table_args__ = (
        CheckConstraint("hospitals_count >= 0", name="ck_risk_hospitals_non_negative"),
        CheckConstraint(
            "validation_status IN ('pending','approved','rejected')",
            name="ck_risk_validation_status",
        ),
        Index("idx_risk_records_updated_at", "updated_at"),
        Index("idx_risk_records_validation_status", "validation_status"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    province_id: Mapped[int] = mapped_column(
        ForeignKey("provinces.id", ondelete="CASCADE"), index=True
    )
    risk_name: Mapped[str] = mapped_column(String(140))
    causes: Mapped[str] = mapped_column(Text)
    consequences: Mapped[str] = mapped_column(Text)
    affected_population: Mapped[str] = mapped_column(Text)
    hospitals_count: Mapped[int] = mapped_column(Integer)
    avg_daily_patients: Mapped[int | None] = mapped_column(Integer, nullable=True)
    epidemiological_fallback: Mapped[str] = mapped_column(Text)
    source_name: Mapped[str] = mapped_column(String(180))
    source_url: Mapped[str] = mapped_column(Text)
    validation_status: Mapped[str] = mapped_column(String(30), default="approved")
    source_type: Mapped[str] = mapped_column(String(20), default="manual")  # 'manual' or 'sync'
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    province: Mapped["Province"] = relationship(back_populates="risk_records")


class Species(Base):
    __tablename__ = "species_catalog"
    __table_args__ = (
        CheckConstraint("direct_danger IN ('yes','no')", name="ck_species_direct_danger"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    common_name: Mapped[str] = mapped_column(String(120), index=True)
    scientific_name: Mapped[str] = mapped_column(String(160), index=True)
    risk_category: Mapped[str] = mapped_column(String(60), index=True)
    health_impact: Mapped[str] = mapped_column(Text)
    ecosystem_impact: Mapped[str] = mapped_column(Text)
    reference_image_url: Mapped[str] = mapped_column(Text)
    direct_danger: Mapped[str] = mapped_column(String(10), default="no")
