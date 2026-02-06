import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal
from app.models import (
    Project,
    Scenario,
    Requirement,
    WricefItem,
    ConfigItem,
    TestManagement,
)


def now_iso() -> str:
    return datetime.now().isoformat()


def clear_data(session) -> None:
    session.query(TestManagement).delete()
    session.query(ConfigItem).delete()
    session.query(WricefItem).delete()
    session.query(Requirement).delete()
    session.query(Scenario).delete()
    session.query(Project).delete()
    session.commit()


def seed_demo_data() -> None:
    session = SessionLocal()
    try:
        clear_data(session)

        projects = [
            Project(
                project_code="PRJ-001",
                project_name="S/4HANA Finance Transformation",
                customer_name="Arcelik",
                status="active",
                created_at=now_iso(),
            ),
            Project(
                project_code="PRJ-002",
                project_name="SAP MM/WM Migration",
                customer_name="Vestel",
                status="planning",
                created_at=now_iso(),
            ),
            Project(
                project_code="PRJ-003",
                project_name="Order-to-Cash Redesign",
                customer_name="Koc Holding",
                status="active",
                created_at=now_iso(),
            ),
        ]
        session.add_all(projects)
        session.flush()

        project_ids = {project.project_code: project.id for project in projects}

        scenarios = [
            Scenario(
                project_id=project_ids["PRJ-001"],
                scenario_id="S-001",
                name="Order to Cash (O2C)",
                module="SD",
                created_at=now_iso(),
            ),
            Scenario(
                project_id=project_ids["PRJ-001"],
                scenario_id="S-002",
                name="Procure to Pay (P2P)",
                module="MM",
                created_at=now_iso(),
            ),
            Scenario(
                project_id=project_ids["PRJ-001"],
                scenario_id="S-003",
                name="Record to Report (R2R)",
                module="FI",
                created_at=now_iso(),
            ),
            Scenario(
                project_id=project_ids["PRJ-001"],
                scenario_id="S-004",
                name="Plan to Produce",
                module="PP",
                created_at=now_iso(),
            ),
            Scenario(
                project_id=project_ids["PRJ-001"],
                scenario_id="S-005",
                name="Hire to Retire",
                module="HR",
                created_at=now_iso(),
            ),
        ]
        session.add_all(scenarios)

        requirements = [
            Requirement(
                code="REQ-001",
                title="SD Pricing Procedure",
                classification="Fit",
                project_id=project_ids["PRJ-001"],
                created_at=now_iso(),
            ),
            Requirement(
                code="REQ-002",
                title="Custom ATP Check",
                classification="Gap",
                project_id=project_ids["PRJ-001"],
                created_at=now_iso(),
            ),
            Requirement(
                code="REQ-003",
                title="Intercompany Billing",
                classification="Partial Fit",
                project_id=project_ids["PRJ-001"],
                created_at=now_iso(),
            ),
            Requirement(
                code="REQ-004",
                title="MM Auto PO",
                classification="Fit",
                project_id=project_ids["PRJ-001"],
                created_at=now_iso(),
            ),
            Requirement(
                code="REQ-005",
                title="Custom Vendor Evaluation",
                classification="Gap",
                project_id=project_ids["PRJ-001"],
                created_at=now_iso(),
            ),
            Requirement(
                code="REQ-006",
                title="FI Document Splitting",
                classification="Fit",
                project_id=project_ids["PRJ-001"],
                created_at=now_iso(),
            ),
            Requirement(
                code="REQ-007",
                title="Custom Dunning Process",
                classification="Gap",
                project_id=project_ids["PRJ-002"],
                created_at=now_iso(),
            ),
            Requirement(
                code="REQ-008",
                title="PP Scheduling Agreement",
                classification="Partial Fit",
                project_id=project_ids["PRJ-002"],
                created_at=now_iso(),
            ),
        ]
        session.add_all(requirements)
        session.flush()

        requirement_ids = {req.code: req.id for req in requirements}

        wricef_items = [
            WricefItem(
                code="W-001",
                title="Custom ATP Enhancement",
                wricef_type="E",
                project_id=project_ids["PRJ-001"],
                requirement_id=requirement_ids["REQ-002"],
                created_at=now_iso(),
            ),
            WricefItem(
                code="W-002",
                title="Vendor Scoring Report",
                wricef_type="R",
                project_id=project_ids["PRJ-001"],
                requirement_id=requirement_ids["REQ-005"],
                created_at=now_iso(),
            ),
            WricefItem(
                code="W-003",
                title="IDoc for Intercompany",
                wricef_type="I",
                project_id=project_ids["PRJ-001"],
                requirement_id=requirement_ids["REQ-002"],
                created_at=now_iso(),
            ),
            WricefItem(
                code="W-004",
                title="Dunning Workflow",
                wricef_type="W",
                project_id=project_ids["PRJ-002"],
                requirement_id=requirement_ids["REQ-007"],
                created_at=now_iso(),
            ),
        ]
        session.add_all(wricef_items)

        config_items = [
            ConfigItem(
                code="CFG-001",
                title="SD Pricing Config",
                config_type="standard",
                project_id=project_ids["PRJ-001"],
                requirement_id=requirement_ids["REQ-001"],
                created_at=now_iso(),
            ),
            ConfigItem(
                code="CFG-002",
                title="Auto PO Setup",
                config_type="standard",
                project_id=project_ids["PRJ-001"],
                requirement_id=requirement_ids["REQ-004"],
                created_at=now_iso(),
            ),
            ConfigItem(
                code="CFG-003",
                title="Doc Splitting Config",
                config_type="standard",
                project_id=project_ids["PRJ-001"],
                requirement_id=requirement_ids["REQ-006"],
                created_at=now_iso(),
            ),
        ]
        session.add_all(config_items)

        test_cases = [
            TestManagement(
                code="UT-001",
                title="Unit Test: SD Pricing",
                test_type="unit",
                project_id=project_ids["PRJ-001"],
                created_at=now_iso(),
            ),
            TestManagement(
                code="UT-002",
                title="Unit Test: ATP Check",
                test_type="unit",
                project_id=project_ids["PRJ-001"],
                created_at=now_iso(),
            ),
            TestManagement(
                code="SIT-001",
                title="SIT: O2C End-to-End",
                test_type="sit",
                project_id=project_ids["PRJ-001"],
                created_at=now_iso(),
            ),
            TestManagement(
                code="UAT-001",
                title="UAT: Order Processing",
                test_type="uat",
                project_id=project_ids["PRJ-001"],
                created_at=now_iso(),
            ),
            TestManagement(
                code="UAT-002",
                title="UAT: Invoice Verification",
                test_type="uat",
                project_id=project_ids["PRJ-002"],
                created_at=now_iso(),
            ),
        ]
        session.add_all(test_cases)

        session.commit()
    finally:
        session.close()


if __name__ == "__main__":
    seed_demo_data()
