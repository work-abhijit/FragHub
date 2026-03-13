# Game Ground - Gaming Cafe Management System

A complete, production-ready gaming cafe management system with a modern dark cyberpunk gaming aesthetic.

## Features
- Active Dashboard with realtime stats and station monitoring
- Firestore integrated active sessions, user management, and stats
- Automated calculation of limits, grace periods, discounts, and tier tiers
- Recharts integration for tracking Revenue
- Support for multiple session starts, ends, pausing, and resuming

## Tech Stack
- Frontend: React 18 + Vite (TypeScript)
- Design: Tailwind CSS with Glassmorphism
- State: Zustand
- Data/Auth: Firebase / Firestore
- Icons & Animation: Lucide React, Framer Motion
- Forms: React-Hook-Form + Zod

## Installation Instructions

1. **Clone/Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Set your Firebase variables in `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=xxx
   VITE_FIREBASE_AUTH_DOMAIN=xxx
   VITE_FIREBASE_PROJECT_ID=xxx
   VITE_FIREBASE_STORAGE_BUCKET=xxx
   VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
   VITE_FIREBASE_APP_ID=xxx
   ```

3. **Seeding Firestore (Dev Only)**
   Once started, you can run the following in your browser console to seed the 18 stations:
   ```javascript
   window.seedFirestore();
   ```

4. **Running Locally**
   ```bash
   npm run dev
   ```
