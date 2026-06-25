"""
Viral Probability Scorer
Scores each generated clip/post 0-100% based on:
hook strength, timing, niche trends, platform fit, seasonality.
"""

import json
import logging
import math
import random
from datetime import datetime
from typing import Any

logger = logging.getLogger(__name__)


# ── Score Factors Model ─────────────────────────────────────────────────────

class ViralScore:
    """Viral probability score with breakdown by factors."""

    BREAKDOWN_FIELDS = [
        "hook_strength", "engagement_rate", "niche_trending",
        "platform_fit", "timeliness", "seasonality",
    ]

    def __init__(
        self,
        overall_score: float,  # 0-100
        hook_strength: float = 0,
        engagement_rate: float = 0,
        niche_trending: float = 0,
        platform_fit: float = 0,
        timeliness: float = 0,
        seasonality: float = 0,
        reasoning: str = "",
    ) -> None:
        self.overall_score = overall_score
        self.hook_strength = hook_strength
        self.engagement_rate = engagement_rate
        self.niche_trending = niche_trending
        self.platform_fit = platform_fit
        self.timeliness = timeliness
        self.seasonality = seasonality
        self.reasoning = reasoning

    def to_dict(self) -> dict[str, Any]:
        return {
            "overall_score": round(self.overall_score, 1),
            "breakdown": {
                "hook_strength": round(self.hook_strength, 1),
                "engagement_rate": round(self.engagement_rate, 1),
                "niche_trending": round(self.niche_trending, 1),
                "platform_fit": round(self.platform_fit, 1),
                "timeliness": round(self.timeliness, 1),
                "seasonality": round(self.seasonality, 1),
            },
            "reasoning": self.reasoning,
        }


# ── Scorer ─────────────────────────────────────────────────────────────────

class ViralScorer:
    """
    Computes viral probability score using multi-factor analysis.
    """

    def __init__(self) -> None:
        pass

    def score_clip(
        self,
        hook_confidence: float,  # 0-1 from analyzer
        view_count: int,
        like_count: int,
        comment_count: int,
        niche: str,
        duration_sec: float,
        platform_fit_scores: dict[str, float] | None = None,
        published_at: str = "",
        clip_type: str = "hook",
    ) -> ViralScore:
        """
        Compute viral probability score for a clip.
        Returns score 0-100 with per-factor breakdown.
        """
        platform_fit_scores = platform_fit_scores or {}

        # 1) Hook strength (0-100)
        hook_score = hook_confidence * 100

        # 2) Engagement rate (0-100) — higher is better
        eng_score = 0.0
        if view_count > 0:
            like_rate = (like_count / view_count) * 100
            comment_rate = (comment_count / view_count) * 100
            # Typical rates: 2-5% like rate, 0.1-0.5% comment rate
            eng_score = min(100, (like_rate / 5.0) * 50 + (comment_rate / 0.5) * 50)

        # 3) Niche trending score (0-100)
        # Based on how hot this niche is (predefined or computed)
        niche_heat_map = {
            "gaming": 50, "tech": 80, "comedy": 65, "music": 55,
            "sports": 45, "news": 60, "education": 70, "howto": 65,
            "vlog": 40, "entertainment": 55, "default": 50,
        }
        niche_score = niche_heat_map.get(niche, niche_heat_map["default"])

        # 4) Platform fit (0-100)
        platform_score = 70.0
        if platform_fit_scores:
            platform_score = sum(platform_fit_scores.values()) / len(platform_fit_scores)

        # 5) Timeliness (0-100) — newer content scores higher
        time_score = 50.0
        if published_at:
            try:
                pub_time = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
                hours_ago = (datetime.utcnow() - pub_time.replace(tzinfo=None)).total_seconds() / 3600
                # Decay: 100 at 0 hours, ~50 at 24h, ~25 at 72h
                time_score = max(0, 100 * math.exp(-0.03 * hours_ago))
            except (ValueError, TypeError):
                pass

        # 6) Seasonality (0-100) — check if this content type is seasonal
        season_score = self._compute_seasonality(niche)

        # ── Composite score ────────────────────────────────────────────
        weights = {
            "hook_strength": 0.30,
            "engagement_rate": 0.20,
            "niche_trending": 0.20,
            "platform_fit": 0.15,
            "timeliness": 0.10,
            "seasonality": 0.05,
        }

        overall = (
            hook_score * weights["hook_strength"]
            + eng_score * weights["engagement_rate"]
            + niche_score * weights["niche_trending"]
            + platform_score * weights["platform_fit"]
            + time_score * weights["timeliness"]
            + season_score * weights["seasonality"]
        )

        # Cap at 100
        overall = min(100, overall)

        return ViralScore(
            overall_score=overall,
            hook_strength=hook_score,
            engagement_rate=eng_score,
            niche_trending=niche_score,
            platform_fit=platform_score,
            timeliness=time_score,
            seasonality=season_score,
            reasoning=f"Clip type '{clip_type}' in niche '{niche}' — "
                      f"hook strength {hook_score:.0f}, engagement {eng_score:.0f}",
        )

    @staticmethod
    def _compute_seasonality(niche: str) -> float:
        """Compute seasonality score based on month/event."""
        month = datetime.utcnow().month
        # Summer: June-Aug boosts certain niches
        summer_months = {6, 7, 8}
        holiday_months = {11, 12}

        if niche in ("gaming", "entertainment") and month in summer_months:
            return 80.0
        elif niche in ("education", "howto") and month in {1, 9}:
            return 75.0  # New year/back to school
        elif niche in ("music", "entertainment") and month in holiday_months:
            return 70.0
        return 50.0


# ── Public API ─────────────────────────────────────────────────────────────

def score_clip(
    hook_confidence: float,
    view_count: int,
    like_count: int,
    comment_count: int,
    niche: str,
    duration_sec: float,
    platform_fit_scores: dict[str, float] | None = None,
    published_at: str = "",
    clip_type: str = "hook",
) -> dict[str, Any]:
    """Score a clip for viral probability. Returns dict with score and breakdown."""
    scorer = ViralScorer()
    score = scorer.score_clip(
        hook_confidence, view_count, like_count, comment_count,
        niche, duration_sec, platform_fit_scores, published_at, clip_type,
    )
    return score.to_dict()


if __name__ == "__main__":
    result = score_clip(
        hook_confidence=0.85,
        view_count=500_000,
        like_count=35_000,
        comment_count=1_200,
        niche="tech",
        duration_sec=30.0,
        published_at="2025-06-22T10:00:00Z",
        clip_type="hook",
    )
    print(json.dumps(result, indent=2))