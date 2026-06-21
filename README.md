# 🌱 GreenPulse — Carbon Footprint Assistant & Eco AI Advisor

**GreenPulse** is a modern, interactive web application designed to help users measure, track, and actively reduce their daily carbon footprint. By combining social gamification, real-time logging, and advanced AI agent integrations, GreenPulse transforms ecological awareness into a collaborative, engaging, and rewarding experience.

Ridding Gen Z of climate anxiety by actively crushing daily emissions! 🚀🚴‍♂️🥗

---

## ✨ Key Features

- **🤖 Carbon AI Advisor**: Powered by Google Gemini-2.5-flash, our AI advisor answers environmental queries, suggests sustainable tips, and dynamically registers users or logs carbon activities directly from conversations.
- **📊 Eco Dashboard & Logger**: Log daily actions across transit, diet, energy, and waste (e.g. commuting by bike, choosing plant-based meals, composting). Track your real-time carbon reduction (kg CO₂e), streak count 🔥, and overall EcoPoints!
- **✨ AI Hype Caption Generator**: Generates engaging, trendy Gen Z social captions (and spicy roasts 💀) for your eco-friendly logs using Gemini, ready to post to the community feed.
- **🎴 Share Card Creator**: Design and export gorgeous customizable cards (Modern Glassmorphism, Retro Terminal, Neon Cyberpunk, Minimalist Grid) illustrating your carbon-reduction achievements.
- **📱 Green Social Feed**: Share milestones, attach images, write custom comments, and react to community logs.
- **🏆 Gamified Leaderboards**: Climb the footprint and points leaderboards! A weekly Apex Season engine takes snapshots and automatically awards digital achievement badges to the top 3 players.
- **📸 Carbon Scanner**: Upload a picture or select presets to estimate active usage and lifecycle carbon impacts of items, complete with customized eco-ratings and improvement tips.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS v4, Motion (Framer), Lucide Icons.
- **Backend**: Node.js, Express, `@google/genai` (Google Gen AI SDK).
- **Deployment**: Vercel Serverless Functions (`api/index.ts`).

---

## 🚀 Deployed on Vercel

GreenPulse is optimized to run 100% serverless on Vercel.

### 1. Environment Variable Setup
Before deploying, make sure to add your Google Gemini API key to your Vercel Dashboard:
- Go to **Project Settings** -> **Environment Variables**.
- Add a new variable with the key `GEMINI_API_KEY` and paste your Gemini API key as the value.

### 2. Deployment
To push the project to Vercel, simply push to your connected Git repository (automatic deployment) or deploy manually via the Vercel CLI:
```bash
vercel --prod
```

---

## 💻 Local Development

### Prerequisites
- Node.js (v20+)

### Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set your `GEMINI_API_KEY`:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Run the development server (runs both Vite and the Express API server):
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3001](http://localhost:3001) in your browser.
