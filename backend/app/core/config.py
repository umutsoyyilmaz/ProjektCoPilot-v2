from pydantic_settings import BaseSettings
from pathlib import Path
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "ProjektCoPilot"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"

    DATABASE_PATH: Path = Path(
        os.environ.get(
            "DATABASE_PATH",
            "/workspaces/ProjektCoPilot/project_copilot.db"
        )
    )

    @property
    def DATABASE_URL(self) -> str:
        return f"sqlite:///{self.DATABASE_PATH}"

    class Config:
        case_sensitive = True


settings = Settings()
