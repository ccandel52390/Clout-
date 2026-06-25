"""
YouTube & Social Platform Scanner
Fetches trending video metadata and identifies viral content candidates.
"""

import csv
import json
import logging
import os
import random
from datetime import datetime, timedelta
from typing import Any

logger = logging.getLogger(__name__)

# ── Data Model ──────────────────────────────────────────────────────────────

YOUTUBE_TRENDING_NICHES = [
    "gaming", "tech", "comedy", "music", "sports",
    "news", "education", "howto", "vlog", "entertainment",
]


class VideoMetadata:
    """Normalized metadata for a video from any source."""

    def __init__(
        self,
        video_id: str,
        title: str,
        channel: str,
        platform: str,
        duration_sec: int,
        view_count: int,
        like_count: int,
        comment_count: int,
        published_at: str,
        niche: str,
        thumbnail_url: str = "",
        description: str = "",
        tags: list[str] | None = None,
        category: str = "",
    ) -> None:
        self.video_id = video_id
        self.title = title
        self.channel = channel
        self.platform = platform
        self.duration_sec = duration_sec
        self.view_count = view_count
        self.like_count = like_count
        self.comment_count = comment_count
        self.published_at = published_at
        self.niche = niche
        self.thumbnail_url = thumbnail_url
        self.description = description
        self.tags = tags or []

    def to_dict(self) -> dict[str, Any]:
        return {
            "video_id": self.video_id,
            "title": self.title,
            "channel": self.channel,
            "platform": self.platform,
            "duration_sec": self.duration_sec,
            "view_count": self.view_count,
            "like_count": self.like_count,
            "comment_count": self.comment_count,
            "published_at": self.published_at,
            "niche": self.niche,
            "thumbnail_url": self.thumbnail_url,
            "description": self.description,
            "tags": self.tags,
        }


# ── Scanner: YouTube API (primary) ─────────────────────────────────────────

class YouTubeScanner:
    """
    Scans YouTube trending and channel feeds using the YouTube Data API v3.
    Falls back to simulated data if no API key is available.
    """

    BASE_URL = "https://www.googleapis.com/youtube/v3"

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key or os.getenv("YOUTUBE_API_KEY", "")

    def fetch_trending(self, max_results: int = 20, niche: str = "") -> list[VideoMetadata]:
        """Fetch trending videos from YouTube."""
        if not self.api_key:
            logger.warning("No YouTube API key — using simulated data")
            return self._simulate_trending(max_results, niche)

        # Real API call
        import requests

        params: dict[str, Any] = {
            "part": "snippet,statistics,contentDetails",
            "chart": "mostPopular",
            "maxResults": min(max_results, 50),
            "key": self.api_key,
        }
        if niche:
            # Map niche to YouTube category ID if known
            category_map = {
                "gaming": "20", "comedy": "23", "music": "10",
                "sports": "17", "news": "25", "education": "27",
                "tech": "28", "entertainment": "24",
            }
            if niche in category_map:
                params["videoCategoryId"] = category_map[niche]

        resp = requests.get(f"{self.BASE_URL}/videos", params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        videos: list[VideoMetadata] = []
        for item in data.get("items", []):
            snippet = item.get("snippet", {})
            stats = item.get("statistics", {})
            content = item.get("contentDetails", {})

            # Parse ISO 8601 duration
            duration_str = content.get("duration", "PT0S")
            duration_sec = self._parse_iso_duration(duration_str)

            videos.append(VideoMetadata(
                video_id=item["id"],
                title=snippet.get("title", ""),
                channel=snippet.get("channelTitle", ""),
                platform="youtube",
                duration_sec=duration_sec,
                view_count=int(stats.get("viewCount", 0)),
                like_count=int(stats.get("likeCount", 0)),
                comment_count=int(stats.get("commentCount", 0)),
                published_at=snippet.get("publishedAt", ""),
                niche=niche or "general",
                thumbnail_url=snippet.get("thumbnails", {}).get("high", {}).get("url", ""),
                description=snippet.get("description", ""),
                tags=snippet.get("tags", []),
            ))
        return videos

    def fetch_channel_videos(
        self, channel_id: str, max_results: int = 20, niche: str = ""
    ) -> list[VideoMetadata]:
        """Fetch recent videos from a specific channel."""
        if not self.api_key:
            logger.warning("No YouTube API key — using simulated data")
            return self._simulate_channel_feed(max_results, niche)

        import requests

        # Step 1: get upload playlist ID
        chan_resp = requests.get(
            f"{self.BASE_URL}/channels",
            params={
                "part": "contentDetails",
                "id": channel_id,
                "key": self.api_key,
            },
            timeout=15,
        )
        chan_resp.raise_for_status()
        chan_data = chan_resp.json()
        if not chan_data.get("items"):
            return []
        playlist_id = chan_data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

        # Step 2: get playlist items
        pl_resp = requests.get(
            f"{self.BASE_URL}/playlistItems",
            params={
                "part": "snippet",
                "playlistId": playlist_id,
                "maxResults": min(max_results, 50),
                "key": self.api_key,
            },
            timeout=15,
        )
        pl_resp.raise_for_status()
        items = pl_resp.json().get("items", [])

        video_ids = [item["snippet"]["resourceId"]["videoId"] for item in items if "resourceId" in item["snippet"]]

        # Step 3: get video stats
        vid_resp = requests.get(
            f"{self.BASE_URL}/videos",
            params={
                "part": "snippet,statistics,contentDetails",
                "id": ",".join(video_ids),
                "key": self.api_key,
            },
            timeout=15,
        )
        vid_resp.raise_for_status()
        vid_data = vid_resp.json()

        videos: list[VideoMetadata] = []
        for item in vid_data.get("items", []):
            snippet = item.get("snippet", {})
            stats = item.get("statistics", {})
            content = item.get("contentDetails", {})
            duration_str = content.get("duration", "PT0S")
            duration_sec = self._parse_iso_duration(duration_str)

            videos.append(VideoMetadata(
                video_id=item["id"],
                title=snippet.get("title", ""),
                channel=snippet.get("channelTitle", ""),
                platform="youtube",
                duration_sec=duration_sec,
                view_count=int(stats.get("viewCount", 0)),
                like_count=int(stats.get("likeCount", 0)),
                comment_count=int(stats.get("commentCount", 0)),
                published_at=snippet.get("publishedAt", ""),
                niche=niche or "general",
                thumbnail_url=snippet.get("thumbnails", {}).get("high", {}).get("url", ""),
                description=snippet.get("description", ""),
                tags=snippet.get("tags", []),
            ))
        return videos

    # ── Helpers ─────────────────────────────────────────────────────────

    @staticmethod
    def _parse_iso_duration(duration: str) -> int:
        """Parse ISO 8601 duration string like PT1H30M15S → seconds."""
        import re
        match = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration)
        if not match:
            return 0
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3) or 0)
        return hours * 3600 + minutes * 60 + seconds

    @staticmethod
    def _simulate_trending(max_results: int, niche: str) -> list[VideoMetadata]:
        """Generate realistic-looking simulated data for prototyping."""
        videos: list[VideoMetadata] = []
        now = datetime.utcnow()
        titles = [
            "The TRUTH about AI in 2025 (you won't believe)",
            "I Tried 100 Life Hacks in 24 Hours",
            "This NEW App Changed EVERYTHING",
            "How I Made $10k in One Week (Full Guide)",
            "The Most INSANE Gaming Moment Ever",
            "Why Everyone is Switching to THIS",
            "I Built a Startup in 48 Hours (Here's What Happened)",
            "The SECRET to Going Viral on TikTok",
            "This AI Tool is BETTER Than ChatGPT",
            "10 Minutes That Will Change Your Life",
            "The ULTIMATE Productivity Hack",
            "I Tested 50 AI Tools So You Don't Have To",
        ]
        channels = [
            "TechReview", "DailyVlog", "GamingPro", "LifeHacker",
            "BusinessInsider", "AIExplained", "TrendSpotter", "CreatorHub",
        ]

        for i in range(max_results):
            title = random.choice(titles)
            view_base = random.randint(10_000, 5_000_000)
            publish_delta = timedelta(hours=random.randint(1, 168))
            videos.append(VideoMetadata(
                video_id=f"sim_{i}",
                title=title,
                channel=random.choice(channels),
                platform="youtube",
                duration_sec=random.choice([300, 480, 600, 900, 1200, 1800]),
                view_count=view_base,
                like_count=int(view_base * random.uniform(0.02, 0.08)),
                comment_count=int(view_base * random.uniform(0.001, 0.01)),
                published_at=(now - publish_delta).isoformat() + "Z",
                niche=niche or random.choice(YOUTUBE_TRENDING_NICHES),
                thumbnail_url=f"https://i.ytimg.com/vi/sim_{i}/hqdefault.jpg",
                description=f"This is a simulated description for: {title}",
                tags=[niche, "viral", "trending"],
            ))
        return videos

    @staticmethod
    def _simulate_channel_feed(max_results: int, niche: str) -> list[VideoMetadata]:
        """Simulated channel feed for prototyping."""
        return YouTubeScanner._simulate_trending(max_results, niche)


# ── Social Platform Scanner ────────────────────────────────────────────────

class SocialScanner:
    """
    Scans TikTok, Instagram, Twitter/X for trending posts.
    Currently returns simulated data; real API integration requires
    platform-specific API keys.
    """

    PLATFORMS = ["tiktok", "instagram", "twitter"]

    def __init__(self) -> None:
        pass

    def fetch_trending(self, niche: str = "", max_per_platform: int = 10) -> dict[str, list[dict[str, Any]]]:
        """Fetch trending posts across social platforms."""
        results: dict[str, list[dict[str, Any]]] = {}
        for platform in self.PLATFORMS:
            results[platform] = self._simulate_platform_posts(platform, niche, max_per_platform)
        return results

    @staticmethod
    def _simulate_platform_posts(
        platform: str, niche: str, count: int
    ) -> list[dict[str, Any]]:
        """Simulated social media trending posts."""
        posts: list[dict[str, Any]] = []
        now = datetime.utcnow()
        captions = [
            "POV: You just discovered the hack of the year 🔥",
            "Wait for it... #viral #fyp",
            "This changes EVERYTHING 🤯",
            "Tag someone who needs to see this 👇",
            "The algorithm blessed me today ✨",
            "I can't believe this actually works",
            "Rate this from 1-10 💬",
            "Only 1% can do this challenge",
        ]

        for i in range(count):
            posts.append({
                "post_id": f"{platform}_sim_{i}",
                "platform": platform,
                "caption": random.choice(captions),
                "username": f"creator_{random.randint(1000, 9999)}",
                "likes": random.randint(500, 500_000),
                "comments": random.randint(10, 5_000),
                "shares": random.randint(5, 20_000),
                "niche": niche or random.choice(YOUTUBE_TRENDING_NICHES),
                "posted_at": (now - timedelta(hours=random.randint(1, 72))).isoformat() + "Z",
                "hashtags": [f"#{niche}", "#viral", "#trending", "#fyp"],
                "music_track": random.choice(["Original Sound", "Popular Song 2025", "Trending Audio #1"]),
            })
        return posts


# ── Public API ─────────────────────────────────────────────────────────────

def scan_youtube_trending(
    api_key: str = "", max_results: int = 20, niche: str = ""
) -> list[VideoMetadata]:
    """Convenience: scan YouTube trending."""
    scanner = YouTubeScanner(api_key)
    return scanner.fetch_trending(max_results, niche)


def scan_social_trending(
    niche: str = "", max_per_platform: int = 10
) -> dict[str, list[dict[str, Any]]]:
    """Convenience: scan social platforms."""
    scanner = SocialScanner()
    return scanner.fetch_trending(niche, max_per_platform)


# ── CLI entry ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    niche = sys.argv[1] if len(sys.argv) > 1 else ""
    videos = scan_youtube_trending(niche=niche, max_results=5)
    for v in videos:
        print(f"  - [{v.niche}] {v.title} ({v.view_count:,} views)")
    print(f"\nFound {len(videos)} trending videos.")