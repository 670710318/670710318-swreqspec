from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Time,
    DateTime,
    ForeignKey,
    MetaData,
)
from sqlalchemy.orm import declarative_base, relationship

metadata = MetaData()
Base = declarative_base(metadata=metadata)


class Slot(Base):
    """รองรับ: FR-BKG-01, FR-BKG-06, CON-TECH-01"""
    __tablename__ = "slots"
    id = Column(Integer, primary_key=True, autoincrement=True)
    slot_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    package_code = Column(String(50), nullable=False)
    capacity = Column(Integer, nullable=False)
    remaining = Column(Integer, nullable=False)


class Booking(Base):
    """รองรับ: FR-BKG-02, FR-BKG-04, IF-HIS-01, CON-TECH-01"""
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    hn = Column(String(64), nullable=False)  # IF-HIS-01: เก็บ HN เท่านั้น ไม่เก็บ national_id
    slot_id = Column(Integer, ForeignKey("slots.id"), nullable=False)
    booking_date = Column(Date, nullable=False)
    status = Column(String(32), nullable=False, default="booked")
    created_at = Column(DateTime, nullable=False)

    slot = relationship("Slot")


class AuditLog(Base):
    """รองรับ: DOM-PDPA-01, CON-TECH-01"""
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    actor_id = Column(String(64), nullable=False)
    action = Column(String(128), nullable=False)
    hn = Column(String(64), nullable=True)
    accessed_at = Column(DateTime, nullable=False)
