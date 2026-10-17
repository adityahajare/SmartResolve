# SmartResolve — AI-Powered Intelligent Complaint Management Platform

SmartResolve transforms conventional FIFO complaint queues with dynamic AI sentiment tracking, OS priority scheduling (preemption & aging), multi-channel ingestion, and automated root-cause clustering.

---

## 📁 Project Architecture

The project is structured into two main primary sections:

```
SmartResolve/
├── frontend/                   → React 18 + Vite + Tailwind CSS + Zustand
│   ├── src/
│   │   ├── pages/customer/     (Home, RaiseComplaint, AIChat, VoiceEvidence, MyComplaints, etc.)
│   │   ├── pages/admin/        (Dashboard, TicketQueue, SmartImprover, IncidentHeatmap, etc.)
│   │   ├── components/         (UI badges, layout wrappers, route guards)
│   │   ├── store/              (Zustand state management)
│   │   └── services/           (Axios API client)
│   └── package.json
│
├── backend/                    → Node.js + Express + Mongoose + Socket.io
│   ├── src/
│   │   ├── models/             (Ticket, User, SubTask, Incident, Notification, etc.)
│   │   ├── controllers/        (Auth, Tickets, Analytics, Users, etc.)
│   │   ├── services/           (RoutingEngine, PriorityScheduler, EscalationEngine, SLA)
│   │   ├── routes/             (REST endpoints)
│   │   └── socket/             (Real-time bi-directional events)
│   │
│   └── ml-service/             → Python FastAPI ML Engine
│       ├── routes/             (analyze, sentiment, classify, forecast, ocr, stt, dna)
│       ├── models/             (sentiment, classifier, urgency, frustration models)
│       ├── utils/              (priority_scorer, dna_fingerprint, threat_detector)
│       ├── requirements.txt
│       └── main.py
│
├── docker-compose.yml
└── package.json
```

---

## 🚀 Getting Started

### 1. Backend & ML Service Setup

#### Node.js Backend:
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

#### Python ML Service:
```bash
cd backend/ml-service
python -m venv venv
venv\Scripts\activate       # On Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Running on http://localhost:8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🐳 Docker Deployment

Run all services (MongoDB + Backend + ML Service + Frontend) in one command:
```bash
docker-compose up --build
```
