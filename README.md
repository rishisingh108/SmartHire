<div align="center">

# 🚀 SmartHire

### AI-Powered Full Stack Recruitment Platform

Smart resume screening, real-time interviews, and end-to-end hiring — all in one platform.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai)

</div>

---

<!-- 
📸 SCREENSHOTS PLACEHOLDER
Deploy karne ke baad niche wale tags me screenhots ka public link daal dena 
-->
## 📸 App Preview

| Recruiter Dashboard | Real-Time Interview & Chat |
|---|---|
| *[Add Dashboard Screenshot Link Here]* | *[Add Chat/Interview Screenshot Link Here]* |

---

## 📖 About

**SmartHire** is a full stack AI-powered recruitment platform designed to simplify hiring for recruiters and job seekers alike. It combines automated resume screening, semantic candidate matching, real-time interview scheduling, and application tracking into a single, modern platform.

The project is built as a **monorepo-style setup** with a decoupled **Next.js frontend** and a **NestJS backend**, backed by PostgreSQL, Redis-powered background jobs, and AI-driven resume intelligence using OpenAI and Pinecone vector search.

---

## ✨ Features

- 🔐 **Authentication & Authorization** — JWT-based auth with role-based access (Recruiter, Candidate, Admin)
- 🧠 **AI Resume Screening** — Automated resume parsing (PDF) and AI-powered candidate evaluation using OpenAI
- 🔍 **Semantic Candidate Matching** — Vector similarity search via Pinecone for smarter job-candidate matching
- 💼 **Job Postings & Applications** — Recruiters can post jobs; candidates can apply and track application status
- 🎥 **Real-Time Interviews** — Live interview scheduling and communication powered by WebSockets (Socket.io)
- 💬 **In-App Chat** — Real-time messaging between recruiters and candidates
- ⚙️ **Background Job Processing** — Async resume processing queue using Bull + Redis
- ☁️ **Cloud File Storage** — Resume and document uploads stored via AWS S3
- 📧 **Email Notifications** — Automated email notifications via Nodemailer
- 🏢 **Company Profiles** — Dedicated company/recruiter profile management
- 🐳 **Dockerized Infrastructure** — PostgreSQL & Redis services managed via Docker Compose

---

## 🏗️ System Architecture & AI Flow

Here is how the AI Resume Screening & Semantic Search works under the hood:

1. **Resume Upload:** Candidate uploads a PDF resume -> Stored securely in an **AWS S3 Bucket**.
2. **Text Extraction:** Backend extracts raw string text from the uploaded PDF document using `pdf-parse`.
3. **Queue Processing:** The text and processing task are pushed to a **BullMQ** queue backed by **Redis** to ensure non-blocking asynchronous execution.
4. **Vector Embedding:** The processing worker sends the clean text to OpenAI's Embedding Model (`text-embedding-3-small`) to get a high-dimensional vector.
5. **Vector Storage:** The generated embeddings along with metadata are upserted into the **Pinecone Vector Database**.
6. **Semantic Matching:** When a recruiter creates a job description, query embeddings are created and vector similarity calculations match the best-suited candidates instantly.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework (App Router) |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **shadcn/ui + Radix UI** | Accessible UI components |
| **Zustand** | Global state management |
| **TanStack Query** | Server-state / data fetching |
| **React Hook Form + Zod** | Form handling & validation |
| **Axios** | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| **NestJS 11** | Backend framework |
| **TypeScript** | Type safety |
| **PostgreSQL** | Primary database |
| **Prisma ORM** | Database ORM & migrations |
| **Redis + BullMQ** | Background job queues |
| **Socket.io** | Real-time WebSocket communication |
| **JWT + Passport** | Authentication |
| **AWS S3** | File/resume storage |
| **OpenAI API** | AI resume screening & evaluation |
| **Pinecone** | Vector database for semantic search |
| **pdf-parse** | Resume (PDF) text extraction |
| **Nodemailer** | Email notifications |

### DevOps
- **Docker & Docker Compose** — Local PostgreSQL and Redis services

---

## 📁 Project Structure

SmartHire/
├── backend/                  # NestJS API server
│   ├── prisma/               # Database schema & migrations
│   ├── src/
│   │   ├── ai/               # AI resume screening & processing
│   │   ├── applications/     # Job application logic
│   │   ├── auth/             # Authentication (JWT)
│   │   ├── chat/             # Real-time chat
│   │   ├── companies/        # Company/recruiter profiles
│   │   ├── interviews/       # Interview scheduling (WebSocket gateway)
│   │   ├── jobs/             # Job postings
│   │   └── upload/           # File upload (AWS S3)
│   └── package.json
│
├── frontend/                 # Next.js client app
│   ├── src/
│   │   ├── app/              # App Router pages (auth, dashboard)
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # API client & utilities
│   │   └── store/            # Zustand stores
│   └── package.json
│
├── docker-compose.yml        # PostgreSQL + Redis services
└── README.md


---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **Docker & Docker Compose**
- An **OpenAI API key**
- A **Pinecone** account & index configured with **1536 dimensions** (for standard OpenAI embeddings)
- An **AWS S3 bucket** configured for file storage

### 1. Clone the repository
```bash
git clone [https://github.com/rishisingh108/SmartHire.git](https://github.com/rishisingh108/SmartHire.git)
cd SmartHire
2. Start PostgreSQL & Redis via Docker
Bash
docker-compose up -d
3. Set up the Backend
Bash
cd backend
npm install
Create a .env file in backend/ by referencing the Environment Variables schema below. Then execute database migrations and seed baseline data:

Bash
# Apply database migrations
npx prisma migrate dev

# Seed database with initial roles/data (if configured)
npx prisma db seed

# Start server in development mode
npm run start:dev
Backend server runs on http://localhost:3001

📖 API Interactive Docs: When the server is online, you can view the complete Swagger API suite at http://localhost:3001/api/docs.

4. Set up the Frontend
Bash
cd ../frontend
npm install
Create a .env.local file in frontend/ (see schema below), then spin up the development engine:

Bash
npm run dev
Frontend interface runs on http://localhost:3000

🔑 Environment Variables
backend/.env

Code snippet
DATABASE_URL="postgresql://admin:secret123@localhost:5432/smarthire"
JWT_SECRET="your_jwt_secret_here"

# AWS S3 Storage Config
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_REGION="your_aws_region"
AWS_BUCKET_NAME="your_bucket_name"

# OpenAI + Pinecone API Details
OPENAI_API_KEY="your_openai_api_key"
PINECONE_API_KEY="your_pinecone_api_key"
PINECONE_INDEX="your_pinecone_index_name"

# Email Notifications SMTP Configuration
EMAIL_USER="your_email@example.com"
EMAIL_PASS="your_email_app_password"

PORT=3001
frontend/.env.local

Code snippet
NEXT_PUBLIC_API_URL="http://localhost:3001"
⚠️ Security Warning: Never commit actual .env files into source control repositories. They are ignored locally via rules defined inside .gitignore.

🐳 Docker Services
The docker-compose.yml configuration standardizes core dependencies:

PostgreSQL 15 — Exposed on localhost:5432

Redis 7 — Exposed on localhost:6379 (Required for BullMQ queues)

Bash
docker-compose up -d      # Boots background database and cache instances
docker-compose down       # Stops and destroys runtime active containers
🛠️ Troubleshooting
Prisma Connection Errors: If migrations or queries fail due to database handshakes, ensure the Docker service is healthy via docker ps before running Prisma workflows.

Pinecone Vector Dimension Mismatch: OpenAI's text-embedding-3-small generates 1536 dimensions. Verify that your target Pinecone index instance matches this exact number, otherwise upserts will return errors.

CORS Blockers: If network requests from Next.js fail inside client workflows, double check that port values specified in NEXT_PUBLIC_API_URL exactly mirror the server port on the backend environment config.

🗺️ Roadmap
[ ] CI/CD pipeline setup

[ ] Production Docker images for frontend & backend

[ ] Automated testing coverage

[ ] Notification system enhancements

📄 License
This project is licensed under the MIT License.

👤 Author
Rishi Singh

GitHub: @rishisingh108

