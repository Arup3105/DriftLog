# 🔍 Driftlog

> **Detect when your production server has drifted from your GitHub main branch.**

[![CI](https://github.com/YOUR_USERNAME/driftlog/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/driftlog/actions)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green)
![Docker](https://img.shields.io/badge/Docker-ready-blue)

---

## What is Drift?

Drift happens when your live production server is running code that doesn't match your GitHub `main` branch.

Common causes:
- A developer SSH'd into the server and made a hotfix directly
- A deployment failed halfway, leaving an old version running
- Someone pushed directly to the server bypassing the CI/CD pipeline

Driftlog monitors your repos and alerts you the moment drift is detected.

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Next.js App (App Router)           │
│                                                      │
│  ┌──────────────┐        ┌───────────────────────┐   │
│  │  Dashboard   │        │     API Routes        │   │
│  │  (React UI)  │◄──────►│  /api/repos           │   │
│  └──────────────┘        │  /api/drift/check     │   │
│                          │  /api/drift/logs      │   │
│                          │   /api/drift/snapshot │   │
│                          │  /api/settings/       │   │
│                          └──────────┬────────────┘   │
└──────────────────────────────────────┼───────────────┘
                                       │
              ┌────────────────────────┼────────────────┐
              │                        │                │
     ┌────────▼───────┐    ┌───────────▼──────┐         │
     │   MongoDB      │    │   GitHub API     │         │
     │   (Repos +     │    │   (Octokit)      │         │
     │   DriftLogs)   │    │   Fetch tree/SHAs│         │
     └────────────────┘    └──────────────────┘         │
                                                        │
┌───────────────────────────────────────────────────────┘
│  DevOps Layer
│
│  Docker + Docker Compose  →  containerized app + mongo
│  GitHub Actions           →  lint, build, docker on every push
└───────────────────────────────────────────────────────
```

---

## How it works

1. **Add a repo** — paste a GitHub owner/repo name
2. **Mark deployed** — Driftlog takes a snapshot of the current file tree (file paths + SHA hashes)
3. **Check drift** — Driftlog fetches the current main branch tree and compares SHAs
4. If any file has a different SHA → **DRIFT DETECTED** 🚨

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Next.js API Routes |
| Auth | NextAuth.js (JWT) |
| Database | MongoDB + Mongoose |
| GitHub Integration | Octokit |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/driftlog.git
cd driftlog
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in:
```
MONGODB_URI=mongodb://localhost:27017/driftlog
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run locally

```bash
npm install
npm run dev
```

### 4. Run with Docker

```bash
docker-compose up --build
```

App runs at `http://localhost:3000`

---

## GitHub Token Setup

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate a token with `repo` scope (read access)
3. Add it in Driftlog's Settings page

---

## Project Structure

```
driftlog/
├── app/
│   ├── api/
│   │   ├── auth/         # NextAuth + register
│   │   ├── repos/        # Add & list repos
│   │   └── drift/        # Check drift + save snapshot + genarating logs
│   │   └── settings/     # Add github token
│   └── dashboard/        # Main UI
├── lib/
│   ├── mongodb.ts        # DB connection
│   ├── github.ts         # GitHub API helpers
│   └── drift.ts          # Core drift detection logic
├── models/               # Mongoose schemas
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/    # GitHub Actions CI
```
