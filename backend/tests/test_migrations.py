import datetime
import sqlalchemy
from sqlalchemy import create_engine


def test_migration_creates_tables(tmp_path):
    # Create an in-memory SQLite engine to run migration
    engine = create_engine("sqlite:///:memory:")

    # Run the migration
    import backend.app.db.migrations._001_init as mig  # type: ignore

    # The module file is named 001_init.py; import via package path
    # To avoid import name starting with digit, we import using importlib
    import importlib
    mig = importlib.import_module("backend.app.db.migrations.001_init")
    mig.upgrade(engine)

    insp = sqlalchemy.inspect(engine)
    tables = insp.get_table_names()

    assert "slots" in tables
    assert "bookings" in tables
    assert "audit_logs" in tables
