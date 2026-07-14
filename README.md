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

**[🌐 Live Demo](https://smart-hire-mu-ruby.vercel.app/)** · **[⚙️ Backend API](smarthire-production-1443.up.railway.app)**

</div>

---

## 📸 App Preview

| Landing Page | Login |
|---|---|
| ![Landing Page](./screenshots/landing.png) | ![Login Page](./screenshots/login.png) |

| Recruiter Dashboard | Real-Time Interview & Chat |
|---|---|
| ![Recruiter Dashboard](./screenshots/recruiter-dashboard.png) | ![Interview & Chat](./screenshots/interview-chat.png) |

---

## 📖 About

**SmartHire** is a full stack AI-powered recruitment platform designed to simplify hiring for recruiters and job seekers alike. It combines automated resume screening, semantic candidate matching, real-time interview scheduling, and application tracking into a single, modern platform.

The project is built as a **monorepo-style setup** with a decoupled **Next.js frontend** and a **NestJS backend**, backed by PostgreSQL, Redis-powered background jobs, and AI-driven resume intelligence using OpenAI and Pinecone vector search.

**🔗 Live:**
- Frontend: [https://smart-hire-mu-ruby.vercel.app/](https://smart-hire-mu-ruby.vercel.app/) (deployed on Vercel)
- Backend API: [smarthire-production-1443.up.railway.app](smarthire-production-1443.up.railway.app) (deployed on Railway)

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

How AI resume screening & semantic search works under the hood:

1. **Resume Upload** — Candidate uploads a PDF resume → stored securely in an **AWS S3 Bucket**.
2. **Text Extraction** — Backend extracts raw text from the uploaded PDF using `pdf-parse`.
3. **Queue Processing** — The extracted text is pushed to a **BullMQ** queue backed by **Redis**, ensuring non-blocking, asynchronous processing.
4. **Vector Embedding** — A background worker sends the text to OpenAI's embedding model (`text-embedding-3-small`) to generate a high-dimensional vector.
5. **Vector Storage** — The embeddings, along with metadata, are upserted into the **Pinecone** vector database.
6. **Semantic Matching** — When a recruiter creates a job description, its embedding is generated and compared against stored candidate vectors to instantly surface the best-matching candidates.

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

### Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **Railway** | Backend hosting + managed PostgreSQL & Redis |
| **Docker & Docker Compose** | Local development services |

---

## 📁 Project Structure

```
SmartHire/
├── backend/                  # NestJS API server
│   ├── prisma/               # Database schema & migrations
│   ├── src/
│   │   ├── ai/                # AI resume screening & processing
│   │   ├── applications/      # Job application logic
│   │   ├── auth/               # Authentication (JWT)
│   │   ├── chat/               # Real-time chat
│   │   ├── companies/          # Company/recruiter profiles
│   │   ├── interviews/         # Interview scheduling (WebSocket gateway)
│   │   ├── jobs/                # Job postings
│   │   └── upload/              # File upload (AWS S3)
│   └── package.json
│
├── frontend/                 # Next.js client app
│   ├── src/
│   │   ├── app/                 # App Router pages (auth, dashboard)
│   │   ├── components/          # Reusable UI components
│   │   ├── lib/                  # API client & utilities
│   │   └── store/                # Zustand stores
│   └── package.json
│
├── docker-compose.yml        # PostgreSQL + Redis services
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **Docker & Docker Compose**
- An **OpenAI API key**
- A **Pinecone** account & index configured with **1536 dimensions** (for `text-embedding-3-small`)
- An **AWS S3 bucket** configured for file storage

### 1. Clone the repository
```bash
git clone https://github.com/rishisingh108/SmartHire.git
cd SmartHire
```

### 2. Start PostgreSQL & Redis via Docker
```bash
docker-compose up -d
```

### 3. Set up the Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Variables](#-environment-variables)), then run migrations and start the server:

```bash
# Apply database migrations
npx prisma migrate dev

# Seed the database with initial data (if configured)
npx prisma db seed

# Start server in development mode
npm run start:dev
```

Backend runs on **http://localhost:3001**

> 📖 **API Docs:** Once the server is running, view the interactive Swagger API suite at `http://localhost:3001/api/docs`.

### 4. Set up the Frontend
```bash
cd ../frontend
npm install
```

Create a `.env.local` file in `frontend/` (see below), then run:

```bash
npm run dev
```

Frontend runs on **http://localhost:3000**

---

## 🔑 Environment Variables

**`backend/.env`**
```env
DATABASE_URL="postgresql://admin:secret123@localhost:5432/smarthire"
JWT_SECRET="your_jwt_secret_here"

# AWS S3
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_REGION="your_aws_region"
AWS_BUCKET_NAME="your_bucket_name"

# OpenAI + Pinecone
OPENAI_API_KEY="your_openai_api_key"
PINECONE_API_KEY="your_pinecone_api_key"
PINECONE_INDEX="your_pinecone_index_name"

# Email
EMAIL_USER="your_email@example.com"
EMAIL_PASS="your_email_app_password"

PORT=3001
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

> ⚠️ Never commit `.env` files — they are already excluded via `.gitignore`.

---

## 🐳 Docker Services

The `docker-compose.yml` spins up:
- **PostgreSQL 15** — `localhost:5432`
- **Redis 7** — `localhost:6379` (required for BullMQ queues)

```bash
docker-compose up -d      # start services
docker-compose down       # stop services
```

---

## 🛠️ Troubleshooting

- **Prisma connection errors** — If migrations or queries fail, confirm the Docker containers are healthy with `docker ps` before running Prisma commands.
- **Pinecone vector dimension mismatch** — `text-embedding-3-small` generates **1536-dimension** vectors. Make sure your Pinecone index is created with the same dimension, otherwise upserts will fail.
- **CORS errors** — If frontend requests fail, confirm `NEXT_PUBLIC_API_URL` in the frontend matches the actual backend URL/port, and that the backend's `enableCors()` origin list includes your frontend's URL.

---

## 🗺️ Roadmap

- [ ] CI/CD pipeline setup
- [ ] Automated testing coverage
- [ ] Notification system enhancements
- [ ] Production Docker images for frontend & backend

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Rishi Singh**
- GitHub: [@rishisingh108](https://github.com/rishisingh108)

---

<div align="center">
Made with ❤️ and a lot of ☕
</div>
