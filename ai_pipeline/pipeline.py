"""
Main Pipeline Orchestrator
Runs the full content intelligence pipeline:
Scan → Analyze → Generate → Score → Output
"""

import json
import logging
import os
import sys
from datetime import datetime
from typing import Any

from .scanner import YouTubeScanner, SocialScanner
from .analyzer import ContentAnalyzer
from .generator import PostGenerator
from .scorer import ViralScorer

logger = logging.getLogger(__name__)


class PipelineResult:
    """Full pipeline output for a single processed video -> clip picks."""

    def __init__(
        self,
        video: dict[str, Any],
        clips: list[dict[str, Any]],
        posts: list[dict[str, Any]],
        scores: list[dict[str, Any]],
    ) -> None:
        self.video = video
        self.clips = clips
        self.posts = posts
        self.scores = scores
        self.timestamp = datetime.utcnow().isoformat() + "Z"

    def to_dict(self) -> dict[str, Any]:
        return {
            "pipeline_version": "0.1.0",
            "generated_at": self.timestamp,
            "video": self.video,
            "clips": self.clips,
            "posts": self.posts,
            "scores": self.scores,
        }


class ContentPipeline:
    """
    Full end-to-end content intelligence pipeline.
    """

    def __init__(
        self,
        youtube_api_key: str = "",
        llm_api_key: str = "",
    ) -> None:
        self.youtube_api_key = youtube_api_key or os.getenv("YOUTUBE_API_KEY", "")
        self.llm_api_key = llm_api_key or os.getenv("OPENAI_API_KEY", "")
        self.scanner = YouTubeScanner(self.youtube_api_key)
        self.social_scanner = SocialScanner()
        self.analyzer = ContentAnalyzer(self.llm_api_key)
        self.generator = PostGenerator(self.llm_api_key)
        self.scorer = ViralScorer()

    def run(
        self,
        niches: list[str] | None = None,
        max_per_niche: int = 10,
        include_social: bool = True,
    ) -> list[dict[str, Any]]:
        """
        Run the full pipeline:
        1. Scan trending YouTube (and optionally social platforms)
        2. Analyze each video for clip segments
        3. Generate posts (captions, hashtags, thumbnails)
        4. Score each clip for viral probability
        5. Return structured results sorted by score (highest first)
        """
        niches = niches or ["tech", "comedy", "gaming", "education"]
        all_results: list[dict[str, Any]] = []

        for niche in niches:
            logger.info(f"Scanning niche: {niche}")
            try:
                videos = self.scanner.fetch_trending(max_results=max_per_niche, niche=niche)
            except Exception as e:
                logger.error(f"Scan failed for niche '{niche}': {e}")
                continue

            for vid_meta in videos:
                video_dict = vid_meta.to_dict()

                # 2) Analyze for clips
                try:
                    clip_segments = self.analyzer.analyze_video(
                        title=video_dict["title"],
                        description=video_dict["description"],
                        duration_sec=video_dict["duration_sec"],
                        tags=video_dict["tags"],
                        view_count=video_dict["view_count"],
                        like_count=video_dict["like_count"],
                    )
                except Exception as e:
                    logger.warning(f"Analysis failed for {video_dict['video_id']}: {e}")
                    clip_segments = []

                clip_dicts = [c.to_dict() for c in clip_segments]

                # 3) Generate posts
                posts: list[dict[str, Any]] = []
                for clip in clip_dicts:
                    try:
                        post = self.generator.generate(
                            source_video_id=video_dict["video_id"],
                            niche=niche,
                            title=video_dict["title"],
                            description=video_dict["description"],
                            tags=video_dict["tags"],
                            clip_segments=clip_dicts,
                        )
                        posts.append(post.to_dict())
                    except Exception as e:
                        logger.warning(f"Post generation failed for clip: {e}")

                # 4) Score each clip
                scores: list[dict[str, Any]] = []
                for clip in clip_dicts:
                    try:
                        score = self.scorer.score_clip(
                            hook_confidence=clip.get("confidence", 0.5),
                            view_count=video_dict["view_count"],
                            like_count=video_dict["like_count"],
                            comment_count=video_dict["comment_count"],
                            niche=niche,
                            duration_sec=clip.get("duration_sec", 30),
                            published_at=video_dict["published_at"],
                            clip_type=clip.get("clip_type", "hook"),
                        )
                        scores.append(score.to_dict())
                    except Exception as e:
                        logger.warning(f"Scoring failed for clip: {e}")

                result = PipelineResult(video_dict, clip_dicts, posts, scores)
                all_results.append(result.to_dict())

        # Sort by highest viral score across clips
        def _best_score(item: dict[str, Any]) -> float:
            scores = item.get("scores", [])
            if scores:
                return max(s.get("overall_score", 0) for s in scores)
            return 0

        all_results.sort(key=_best_score, reverse=True)
        return all_results

    def run_for_daily_picks(
        self,
        user_niches: list[str] | None = None,
        picks_count: int = 10,
    ) -> list[dict[str, Any]]:
        """
        Generate a user's daily picks: top N clips+posts sorted by viral score.
        This is the main output consumed by the web app.
        """
        all_results = self.run(niches=user_niches)
        # Flatten: each clip+post combination is a "pick"
        picks: list[dict[str, Any]] = []
        for result in all_results:
            video = result["video"]
            for clip, post, score in zip(
                result["clips"], result["posts"], result["scores"]
            ):
                picks.append({
                    "pick_id": f"pick_{video['video_id']}_{clip.get('start_sec', 0)}_{clip.get('clip_type', 'hook')}",
                    "video": video,
                    "clip": clip,
                    "post": post,
                    "score": score,
                    "viral_probability": score.get("overall_score", 0),
                })
        picks.sort(key=lambda p: p["viral_probability"], reverse=True)
        return picks[:picks_count]


# ── Convenience Runner ─────────────────────────────────────────────────────

def run_pipeline(
    niches: list[str] | None = None,
    max_per_niche: int = 10,
    output_file: str = "",
) -> list[dict[str, Any]]:
    """Run pipeline and optionally save to JSON file."""
    pipeline = ContentPipeline()
    results = pipeline.run(niches=niches, max_per_niche=max_per_niche)
    if output_file:
        with open(output_file, "w") as f:
            json.dump(results, f, indent=2)
        logger.info(f"Results saved to {output_file}")
    return results


def generate_daily_picks(
    niches: list[str] | None = None,
    count: int = 10,
    output_file: str = "",
) -> list[dict[str, Any]]:
    """Generate daily picks (ready for web app consumption)."""
    pipeline = ContentPipeline()
    picks = pipeline.run_for_daily_picks(user_niches=niches, picks_count=count)
    if output_file:
        with open(output_file, "w") as f:
            json.dump(picks, f, indent=2)
        logger.info(f"Daily picks saved to {output_file}")
    return picks


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    picks = generate_daily_picks(
        niches=["tech"],
        count=5,
        output_file="/tmp/daily_picks.json",
    )
    print(f"Generated {len(picks)} daily picks")
    for p in picks:
        print(f"  Score {p['viral_probability']:.0f}% — {p['video']['title'][:50]}...")