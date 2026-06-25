# ViralForge — Data Contract (v0.1.0)

> **Status:** Draft  
> **Owner:** AI Content Engineer  
> **Consumer:** Full-Stack Developer (web app frontend/backend)  
> **Format:** JSON (file-based or API response)

## Overview

The AI Pipeline outputs **Daily Picks** — a curated list of ready-to-post content recommendations. The web app consumes this data to display the user's daily content feed.

---

## 1. Daily Picks (Top-Level)

The main output. Consumed by the web app's feed endpoint.

```json
[
  {
    "pick_id": "pick_vid_001_0_hook",
    "video": { ... },
    "clip": { ... },
    "post": { ... },
    "score": { ... },
    "viral_probability": 78.3
  }
]
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `pick_id` | string | Unique pick identifier |
| `video` | object | Source video metadata |
| `clip` | object | Clipped segment metadata |
| `post` | object | Generated post content |
| `score` | object | Viral probability score breakdown |
| `viral_probability` | float | Overall viral score 0-100 |

---

## 2. Video Object

```json
{
  "video_id": "vid_001",
  "title": "The TRUTH about AI in 2025",
  "channel": "TechReview",
  "platform": "youtube",
  "duration_sec": 600,
  "view_count": 500000,
  "like_count": 35000,
  "comment_count": 1200,
  "published_at": "2025-06-22T10:00:00Z",
  "niche": "tech",
  "thumbnail_url": "https://i.ytimg.com/vi/.../hqdefault.jpg",
  "description": "Full video description text...",
  "tags": ["ai", "technology", "future"]
}
```

---

## 3. Clip Segment Object

```json
{
  "video_id": "vid_001",
  "start_sec": 0,
  "end_sec": 30,
  "duration_sec": 30,
  "clip_type": "hook",
  "confidence": 0.85,
  "text_transcript": "What if I told you everything you know about AI is wrong?",
  "reasoning": "Strong opening hook pattern in title"
}
```

### clip_type values
- `hook` — Opening hook/attention grabber
- `peak_moment` — Most engaging mid-video moment
- `cta` — Call-to-action / closing segment
- `educational_insight` — Key learning moment

---

## 4. Generated Post Object

```json
{
  "source_video_id": "vid_001",
  "niche": "tech",
  "captions": [
    "This AI tool changes EVERYTHING 🚀",
    "I tested 50 AI tools so you don't have to",
    "The future of AI is here 🔥"
  ],
  "hashtags": ["#tech", "#ai", "#future", "#innovation", "#viral", "#trending", "#fyp", "#shorts"],
  "thumbnail_concept": "Bold text overlay on AI interface screenshot",
  "platform_recommendations": ["tiktok", "youtube_shorts", "instagram_reels"],
  "post_type": "clip"
}
```

---

## 5. Viral Score Object

```json
{
  "overall_score": 78.3,
  "breakdown": {
    "hook_strength": 85.0,
    "engagement_rate": 70.0,
    "niche_trending": 80.0,
    "platform_fit": 75.0,
    "timeliness": 72.5,
    "seasonality": 50.0
  },
  "reasoning": "Clip type 'hook' in niche 'tech' — hook strength 85, engagement 70"
}
```

### Score factors
| Factor | Weight | Description |
|--------|--------|-------------|
| `hook_strength` | 30% | Quality of the clip's hook |
| `engagement_rate` | 20% | Source video engagement metrics |
| `niche_trending` | 20% | How hot this niche is currently |
| `platform_fit` | 15% | Fit for short-form platforms |
| `timeliness` | 10% | Freshness (newer = higher) |
| `seasonality` | 5% | Seasonal relevance |

---

## 6. API Contract (Suggested Endpoints)

For the web app backend to serve picks to the frontend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/picks` | Get today's picks for current user |
| `GET` | `/api/v1/picks?niche=tech` | Filter by niche |
| `GET` | `/api/v1/picks/{pick_id}` | Get single pick detail |
| `POST` | `/api/v1/picks/{pick_id}/publish` | Mark pick as published |

### Response format for all endpoints:
```json
{
  "status": "ok",
  "data": [ ... ],
  "meta": {
    "generated_at": "2025-06-23T10:00:00Z",
    "count": 10
  }
}
```

---

## 7. Integration Notes for Full-Stack Developer

- **File source (MVP):** The pipeline writes daily picks to a JSON file at `/data/daily_picks.json`. The backend reads this file periodically.
- **API source (production):** Once the pipeline runs server-side, the web app backend calls the pipeline module directly (or via a subprocess) and caches results.
- **Format changes:** Any changes to this data contract must be coordinated between AI Content Engineer and Full-Stack Developer. File a PR against this document.
