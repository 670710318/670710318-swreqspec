"""Initial migration: create slots, bookings, audit_logs tables."""
from sqlalchemy import Table, Column, Integer, String, Date, Time, DateTime, MetaData, ForeignKey


def upgrade(engine):
    meta = MetaData()

    Table(
        "slots",
        meta,
        Column("id", Integer, primary_key=True, autoincrement=True),
        Column("slot_date", Date, nullable=False),
        Column("start_time", Time, nullable=False),
        Column("package_code", String(50), nullable=False),
        Column("capacity", Integer, nullable=False),
        Column("remaining", Integer, nullable=False),
    )

    Table(
        "bookings",
        meta,
        Column("id", Integer, primary_key=True, autoincrement=True),
        Column("hn", String(64), nullable=False),
        Column("slot_id", Integer, ForeignKey("slots.id"), nullable=False),
        Column("booking_date", Date, nullable=False),
        Column("status", String(32), nullable=False),
        Column("created_at", DateTime, nullable=False),
    )

    Table(
        "audit_logs",
        meta,
        Column("id", Integer, primary_key=True, autoincrement=True),
        Column("actor_id", String(64), nullable=False),
        Column("action", String(128), nullable=False),
        Column("hn", String(64), nullable=True),
        Column("accessed_at", DateTime, nullable=False),
    )

    meta.create_all(engine)


def downgrade(engine):
    meta = MetaData()
    meta.reflect(bind=engine)
    for tname in ["audit_logs", "bookings", "slots"]:
        if tname in meta.tables:
            meta.tables[tname].drop(bind=engine)
