# SkillForge

SkillForge is a gamified learning platform built with Next.js, TypeScript, Prisma, PostgreSQL, and Clerk. It explores how learning systems can combine progression mechanics, social features, admin tooling, AI-assisted content generation, and deployable web infrastructure in one codebase.

## Core Features

The repository includes modules and screens for:

- lesson progression and completion tracking
- XP, gems, hearts, and streak-based rewards
- leaderboards, seasons, and league progression
- achievements and unlock tracking
- store items and user purchases
- friendships and activity feeds
- admin content, users, and store management
- tenant and feature-flag data models
- AI-assisted lesson and quiz generation
- offline queue and client-side resilience experiments
- health checks, Docker packaging, and Kubernetes manifests

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| UI | React, Tailwind CSS, Framer Motion |
| Authentication | Clerk |
| Database | PostgreSQL |
| ORM | Prisma |
| Client state | Zustand |
| AI integration | OpenAI SDK |
| Testing | Vitest, Playwright |
| Packaging | Docker |
| Deployment assets | Kubernetes manifests + GitHub Actions |

## Project Structure

```text
app/                  Next.js routes, layouts, admin pages, and API routes
actions/              Server Actions for user and game workflows
components/           Shared UI components
lib/                  Economy, analytics, AI, anti-cheat, and domain helpers
messages/             Internationalization messages
prisma/               PostgreSQL schema and seed data
k8s/                  Kubernetes deployment assets
.github/workflows/    CI/CD workflow
```

## Data Model Highlights

The Prisma schema includes models for users, lessons, courses, leaderboards, achievements, purchases, seasons, friendships, activities, experiments, and tenants.

Progression data such as XP, gems, hearts, streaks, lesson completion, and league placement is persisted in PostgreSQL rather than kept only in client state.

## Economy Rules

The economy module centralizes reward and penalty rules such as:

- base XP and lesson difficulty multipliers
- streak multipliers with a maximum cap
- lesson and streak gem rewards
- heart loss and refill eligibility
- heart regeneration timing

The calculations guard against negative and invalid numeric inputs, and the core rules are covered by Vitest checks.

## AI Lesson Generation

`lib/ai/lessonGenerator.ts` contains optional OpenAI-powered lesson and quiz generation.

The OpenAI client is created lazily, so the rest of the application can be imported and built without immediately requiring an API key. AI generation itself requires:

```bash
OPENAI_API_KEY=your_key_here
```

The quiz generator requests a predictable JSON object containing a `questions` array and validates the response shape before returning it.

## Getting Started

### Requirements

- Node.js 20+
- npm
- PostgreSQL
- Clerk credentials
- OpenAI API key only if using AI generation

### 1. Install dependencies

```bash
npm ci
```

### 2. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

Fill in your PostgreSQL and Clerk values. Add `OPENAI_API_KEY` only when using AI lesson generation.

### 3. Prepare the database

```bash
npx prisma generate
npm run db:push
```

For migration-based development, use:

```bash
npm run db:migrate
```

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verification

Run the local quality checks with:

```bash
npm run check
```

That runs:

1. TypeScript type checking
2. Next.js linting
3. Vitest in one-shot CI mode

The economy tests cover XP clamping, streak caps, gem rewards, heart penalties, refill rules, and deterministic heart-regeneration timing.

End-to-end tests can be run separately with:

```bash
npm run test:e2e
```

## Docker

The Docker build uses all development dependencies in the builder stage so Prisma generation, TypeScript, Tailwind/PostCSS, and the Next.js build are available during compilation. The final image runs the Next.js standalone output as a non-root user.

```bash
docker build -t skillforge .
docker run --env-file .env -p 3000:3000 skillforge
```

## CI/CD

The GitHub Actions workflow performs type checking, linting, and unit tests before image packaging. Tests are treated as required quality checks rather than being allowed to fail silently.

On configured main-branch deployments, the workflow can publish the container to GitHub Container Registry and update the Kubernetes deployment using the repository's `KUBECONFIG` secret.

## Notes

This repository contains both application features and architecture experiments. External services such as PostgreSQL, Clerk, OpenAI, a container registry, and Kubernetes must be configured separately for the corresponding features to run.
