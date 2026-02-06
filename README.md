# ProjektCoPilot v2

## Quick Start

### Backend

```bash
cd /workspaces/ProjektCoPilot-v2/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd /workspaces/ProjektCoPilot-v2/frontend
npm install
npm run dev
```

### Health Check

```bash
curl http://localhost:8000/health
```

Open http://localhost:5173 in your browser.
