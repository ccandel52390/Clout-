# ViralForge (Clout)

ViralForge is an AI-powered platform that continuously scans social media for trending hooks and moments, clips them, and generates high-potential posts with viral probability scores.

## Architecture

ViralForge consists of two main parts:
1. **AI Content Pipeline**: Scans platforms, analyzes content, generates posts, and scores them.
2. **Web Application**: Provides a dashboard for users to browse their daily feed, pick content, and publish.

## Web Application (Next.js)

### Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: SQLite/Turso with Drizzle ORM
- **Auth**: Auth.js (NextAuth v5)

## AI Content Pipeline (Python)

### Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run pipeline (simulated data — no API key needed)
python run_pipeline.py daily-picks --niches tech gaming --count 5
```

### Modules
- **Scanner**: Fetches trending video metadata.
- **Analyzer**: Identifies best hook/peak/CTA moments.
- **Generator**: Creates captions, hashtags, and thumbnail concepts.
- **Scorer**: Computes viral probability score (0-100%).
- **Pipeline**: Orchestrates the flow and outputs Daily Picks.

## Data Contract

The pipeline and web app communicate via a shared data format. 
See [DATA_CONTRACT.md](DATA_CONTRACT.md) for specifications.
