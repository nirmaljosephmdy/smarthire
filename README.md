# SmartHire Portal 🚀

SmartHire is a next-generation, AI-powered recruitment platform designed to transform the hiring process. It allows candidates to submit their applications and resumes, while recruiters can securely log in to access an intelligent HR portal. The application leverages AI to automatically parse resumes, extract skills, generate semantic embeddings, and allow recruiters to perform natural language vector searches to find the perfect candidates instantly.

---

## 🏗️ System Architecture

The application is built using a modern, scalable microservices architecture consisting of three core components:

### 1. Frontend (Next.js)
The public-facing applicant portal and the secure HR dashboard interface.
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4, ShadCN UI, Framer Motion
- **Features**: Candidate Application Flow, HR Dashboard, Semantic Search UI, Candidate Profile Viewer.
- **Port**: `:3000`

### 2. Backend API (NestJS)
The core business logic, database management, and robust API gateway.
- **Framework**: NestJS (TypeScript)
- **Database**: SQLite (via Prisma ORM v5)
- **Features**: Authentication, Application routing, AI Service Orchestration, Data Persistence.
- **Port**: `:3003`

### 3. AI Microservice (FastAPI)
A Python service dedicated to computationally heavy AI tasks.
- **Framework**: FastAPI (Python)
- **Libraries**: `sentence-transformers`, `PyPDF2`
- **Features**: Resume text extraction (PDF/DOCX), embedding generation, semantic similarity scoring, and fallback mocking.
- **Port**: `:8000`

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Git**

*Note: This application has been explicitly designed to be fully runnable locally without Docker or any paid cloud subscriptions.*

---

## 🚀 Getting Started

To get the entire SmartHire platform running locally, you need to set up and start all three services. Open three separate terminal windows and follow the steps below.

### Step 1: Start the AI Microservice
The AI service is responsible for parsing resumes and generating embeddings.

1. Open your first terminal and navigate to the AI service directory:
   ```bash
   cd ai-service
   ```
2. Set up a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the required Python dependencies:
   ```bash
   pip install fastapi uvicorn pydantic sentence-transformers PyPDF2 python-docx
   ```
4. Start the FastAPI server server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
*(The AI service will now be running on `http://localhost:8000`)*

---

### Step 2: Start the Backend (NestJS)
The backend manages the database and serves as the intermediary handler.

1. Open your second terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Setup the SQLite database and run Prisma migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Start the NestJS development server:
   ```bash
   npm run start:dev
   ```
*(The Backend API will now be running on `http://localhost:3003`)*

---

### Step 3: Start the Frontend (Next.js)
The frontend provides the user interfaces for candidates and HR admins.

1. Open your third terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
*(The Frontend application will now be running on `http://localhost:3000`)*

---

## 🔑 Accessing the Application

Once all three services are running, you can access the platform in your browser.

- **Public Applicant Portal:** [http://localhost:3000](http://localhost:3000)
- **HR Secured Portal Login:** [http://localhost:3000/hr/login](http://localhost:3000/hr/login)

**Demo HR Credentials:**
- **Email:** `admin@smarthire.com`
- **Password:** `admin123`

---

## 🗄️ Database GUI (Prisma Studio)
To easily view and edit all the data (Users, Candidates, Notes) directly in your browser, you can use the built-in database graphical interface.

1. Open a new terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start Prisma Studio:
   ```bash
   npx prisma studio
   ```
3. Open [http://localhost:5555](http://localhost:5555) in your web browser.

---

## ⚙️ Environment Variables (Zero-Config)
This application was refactored designed to run fully locally out of the box. **You do NOT need to create a `.env` file.** 
- **Database**: SQLite handles persistence locally in the backend directory without needing configuration.
- **Microservices**: All services are pre-configured to automatically bind to standard development ports (3003, 3000, 8000).

---

## 🧪 Testing the Flow

1. **Apply:** Go to the public portal and submit an application with a PDF/DOCX resume file.
2. **Process:** The Backend will automatically chunk the file and send it to the AI Microservice for processing, extracting the skills and storing them in the SQLite DB.
3. **Review:** Log in to the HR Portal to view the dashboard metrics updating in real-time.
4. **Search:** Navigate to "Semantic Search", search for skills like "Frontend React Developer", and view the beautifully styled candidate profiles!
