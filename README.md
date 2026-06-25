# ViralForge — AI Content Pipeline

> Content intelligence engine that scans YouTube & social platforms for viral content, AI-clips the best hooks/moments, generates trending-content-inspired posts, and scores everything with a viral probability percentage.

## Architecture

```
YouTube/Social Trending
        │
        ▼
  [Scanner] ── fetches trending video metadata
        │
        ▼
  [Analyzer] ── identifies best hook/peak/CTA moments
        │
        ▼
  [Generator] ── creates captions, hashtags, thumbnail concepts
        │
        ▼
  [Scorer] ── computes viral probability score (0-100%)
        │
        ▼
  [Pipeline] ── orchestrates, sorts by score, outputs Daily Picks
```

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run pipeline (simulated data — no API key needed)
python run_pipeline.py daily-picks --niches tech gaming --count 5

# With output to file
python run_pipeline.py daily-picks --niches tech --output /tmp/picks.json --pretty
```

## API Keys (Optional)

For real YouTube data, set in `.env`:
```
YOUTUBE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here   # for LLM-powered analysis
```

Without keys, the pipeline uses realistic simulated data for prototyping.

## Output

The pipeline outputs structured JSON conforming to `DATA_CONTRACT.md`.  
Each "pick" includes: video metadata, clip segment, generated post (captions + hashtags), viral score with breakdown.

## Data Contract

👉 See [DATA_CONTRACT.md](DATA_CONTRACT.md) for the full data format specification shared with the web app team.

## Commands

```bash
# Full pipeline (scan → analyze → generate → score)
python run_pipeline.py full --niches tech gaming education

# Daily picks (top scored content ready for feed)
python run_pipeline.py daily-picks --niches tech --count 10 --pretty

# Just scan
python run_pipeline.py scan --niches tech
```
