from fastapi import APIRouter
from .endpoints.projects import router as projects_router
from .endpoints.scenarios import router as scenarios_router
from .endpoints.analyses import router as analyses_router
from .endpoints.sessions import router as sessions_router
from .endpoints.requirements import router as requirements_router
from .endpoints.wricef_items import router as wricef_router
from .endpoints.config_items import router as config_router
from .endpoints.test_management import router as test_mgmt_router
from .endpoints.test_cycles import router as test_cycles_router
from .endpoints.test_executions import router as test_exec_router
from .endpoints.session_entities import router as session_entities_router
from .endpoints.dashboard import router as dashboard_router

api_router = APIRouter()

api_router.include_router(projects_router)
api_router.include_router(scenarios_router)
api_router.include_router(analyses_router)
api_router.include_router(sessions_router)
api_router.include_router(requirements_router)
api_router.include_router(wricef_router)
api_router.include_router(config_router)
api_router.include_router(test_mgmt_router)
api_router.include_router(test_cycles_router)
api_router.include_router(test_exec_router)
api_router.include_router(session_entities_router)
api_router.include_router(dashboard_router)
