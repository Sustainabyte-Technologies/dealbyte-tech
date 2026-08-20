# Dealbyte

Dealbyte is an end-to-end pricing, quoting, proposal generation, and deal management platform.

## Project Structure

```
Dealbyte/
├── Dealbyte-backend/      # NestJS + Prisma REST API & backend services
└── Dealbyte-ui/           # Next.js App Router UI with Tailwind CSS & Shadcn/UI
```

## Getting Started

### 1. Backend Setup

```bash
cd Dealbyte-backend
npm install
# Configure your environment variables
cp .env.example .env
# Run Prisma migrations / generation
npx prisma generate
# Start backend server
npm run start:dev
```

### 2. Frontend Setup

```bash
cd Dealbyte-ui
npm install
# Configure your environment variables
cp .env.example .env.local
# Start Next.js dev server
npm run dev
```
