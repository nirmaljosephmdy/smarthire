# 🧠 SmartHire: AI-Powered Candidate Assessment & Application Portal

SmartHire is a modern three-tier application designed to revolutionize recruitment. It allows candidates to apply for jobs and upload their resumes, while automatically passing their applications through a custom-built AI microservice. The AI extracts skills, timelines, summaries, and generates mathematical vector embeddings. 

HR professionals can then explore the candidate pool using advanced **Natural Language Semantic Search** to find the absolute best semantic fit for any role, complete with a dynamic fit scoring system and candidate management pipeline.

🔗 **GitHub Repository:** [https://github.com/nirmaljosephmdy/smarthire](https://github.com/nirmaljosephmdy/smarthire)

---

## 🏗️ Architecture Stack

1. **Frontend (`/frontend`)**
   - **Framework:** Next.js 14 (App Router)
   - **Styling:** Tailwind CSS + Shadcn UI + Framer Motion
   - **Features:** Public Apply form, Private HR Dashboard, Semantic Search, Profile View, Admin System Status, Pagination

2. **Backend (`/backend`)**
   - **Framework:** NestJS (TypeScript)
   - **Database:** SQLite via Prisma ORM (`dev.db`)
   - **Features:** RESTful API, Integration & Syncing with AI Service, Cosine Similarity search, Candidate state management, Global Audit Logging.

3. **AI Microservice (`/ai-service`)**
   - **Framework:** Python FastAPI
   - **Core ML:** `sentence-transformers` (all-MiniLM-L6-v2, optimized for CPU limits)
   - **NLP/Parsing:** `spaCy`, `pdfplumber`, `python-docx`
   - **Features:** Resume Parsing (PDF/DOCX), Entity Extraction (Skills, Timeline, Education), Executive Summary Generation, Vector Embeddings for Semantic Search.

---

## ✨ Key Features & Capabilities Built

### 1. The Candidate Experience
- Responsive, modern application form.
- Direct resume file uploads utilizing standard Web Form APIs.
- Instant submission validation with an integrated background queue mapping to the AI service.

### 2. The AI Pipeline
- Resumes are instantly forwarded to the Python pipeline.
- Extracts explicit details (Education, Certifications, Job History, Skills).
- Calculates years of experience and generates an "AI Executive Summary".
- Creates an **embedding vector array** stored natively in the SQLite candidate record.

### 3. HR Semantic Search
- **Natural Language Parsing**: "Senior React developer with 5+ years experience".
- **Dynamic Fit Scoring**: Compares the query's vector embedding against all candidate embeddings in the DB using Cosine Similarity (`backend/src/search/search.service.ts`).
- **Heuristic Filtering**: Parses "5+ years" and explicitly filters out junior applicants before calculating the nearest semantic neighbors.
- **Client-Side Pagination**: Clean 10-result pages with "Showing X-Y of Z" counters and smart tracking.

### 4. HR Operations & Audit
- Fully-featured Candidate Profile page displaying extracted metrics safely.
- **Pipeline Management**: Ability to move candidates from `Pending` -> `Processed` -> `Under Review` -> `Shortlisted` -> `Hired` -> `Rejected`.
- **Private Notes**: HR can add timestamped internal notes on candidate profiles.
- **Admin System Setup UI**: Displays real database logs, architectural statuses, and recent global audit trails.
- Dedicated Database Seeders (`seed-candidates.js`) generating 50 diverse candidates spanning Frontend, Backend, ML, DevOps, and Data paradigms.

---

## 🚀 Running the App Locally

To test everything end-to-end, you need all 3 services running concurrently.

### The Local Dashboard Ports:
* 🌐 **Frontend App:** [http://localhost:3000](http://localhost:3000)
* 💼 **HR Login:** [http://localhost:3000/hr/login](http://localhost:3000/hr/login) *(admin@smarthire.com / admin123)*
* ⚙️ **Backend API base:** `http://localhost:3001`
* 🧠 **AI Microservice base:** `http://localhost:8000`
* 🗄️ **Database UI (Prisma Studio):** [http://localhost:5555](http://localhost:5555)

### Running Everything:

**1. AI Microservice** *(Keep this running so the backend can generate embeddings)*
```bash
cd ai-service
# Assuming you set up your venv and pip installed requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**2. Backend**
```bash
cd backend
npm install
npx prisma db push
npm run start:dev
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```

### Seeding Dummy Data (Crucial for Search Testing)
If the database is empty, search won't work. We built a powerful seeder.
```bash
cd backend
node seed-candidates.js
```
*(This triggers the AI microservice 50 times to generate real vector embeddings for diverse dummy candidates!)*

---

## ☁️ Deployment Guide

SmartHire is configured to easily deploy to the cloud for free testing:
- **Frontend** → Push to **Vercel**
- **AI Microservice & Backend** → Push to **Railway** (SQLite requires persistent volumes).

*Note: The `requirements.txt` inside `/ai-service` is deliberately optimized to use `torch==2.6.0+cpu` alongside the PyTorch CPU extra-index. This shrinks the resulting Docker image by ~2.5GB and comfortably sneaks the heavy ML model under Railway's 4GB free-tier container limits.*

**Steps:**
1. Connect Vercel & Railway to `https://github.com/nirmaljosephmdy/smarthire`.
2. Add Railway volume to `/app/prisma` for SQLite persistence.
3. Configure `AI_SERVICE_URL`, `JWT_SECRET`, and `PORT` on Railway.
4. Configure `NEXT_PUBLIC_API_URL` on Vercel to ping Railway's backend URL.
