# SkillForge

A Duolingo-style gamified learning platform built with modern web architecture.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Prisma ORM, PostgreSQL, Server Actions
- **Auth**: Clerk
- **State**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                 # Next.js App Router
├── actions/             # Server Actions
├── components/          # React components
├── lib/                 # Utilities & helpers
├── prisma/              # Database schema
└── stores/              # Zustand stores
```

## License

MIT
