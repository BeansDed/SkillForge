#!/bin/bash
set -e

echo "🚀 Initializing SkillForge..."

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required"; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start PostgreSQL with Docker
echo "🐘 Starting PostgreSQL..."
docker compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for database..."
sleep 5

# Generate Prisma client and push schema
echo "🔧 Setting up database..."
npx prisma generate
npx prisma db push

# Seed the database
echo "🌱 Seeding database..."
npx prisma db seed || echo "No seed script configured"

# Start dev server
echo "✅ Starting development server..."
npm run dev
