"""
AI Content Analyzer
Analyzes video content to identify the best hook moments,
viral segments, and clip-worthy timestamps.
Uses LLM analysis or heuristic fallback for prototyping.
"""

import json
import logging
import os
import re
from typing import Any

logger = logging.getLogger(__name__)


# ── Clip Segment Model ─────────────────────────────────────────────────────

class ClipSegment:
    """
    A identified clip segment from a video with metadata.
    """

    def __init__(
        self,
        video_id: str,
        start_sec: float,
        end_sec: float,
        clip_type: str,  # "hook", "peak_moment", "cta", "educational_insight"
        confidence: float,
        text_transcript: str = "",
        reasoning: str = "",
    ) -> None:
        self.video_id = video_id
        self.start_sec = start_sec
        self.end_sec = end_sec
        self.duration_sec = round(end_sec - start_sec, 1)
        self.clip_type = clip_type
        self.confidence = confidence
        self.text_transcript = text_transcript
        self.reasoning = reasoning

    def to_dict(self) -> dict[str, Any]:
        return {
            "video_id": self.video_id,
            "start_sec": self.start_sec,
            "end_sec": self.end_sec,
            "duration_sec": self.duration_sec,
            "clip_type": self.clip_type,
            "confidence": self.confidence,
            "text_transcript": self.text_transcript,
            "reasoning": self.reasoning,
        }


# ── Hook / Viral Segment Analyzer ──────────────────────────────────────────

class ContentAnalyzer:
    """
    Analyzes video metadata and (when available) transcript to find
    the best clip moments: hooks, peak moments, CTA segments.
    """

    def __init__(self, llm_api_key: str | None = None) -> None:
        self.llm_api_key = llm_api_key or os.getenv("OPENAI_API_KEY", "")

    def analyze_video(
        self,
        title: str,
        description: str,
        duration_sec: int,
        tags: list[str] | None = None,
        view_count: int = 0,
        like_count: int = 0,
        transcript: str = "",
    ) -> list[ClipSegment]:
        """
        Analyze a video and return the best clip segments.
        Uses LLM if key available, otherwise heuristic rules.
        """
        tags = tags or []
        combined_text = f"{title}\n{description}"

        if self.llm_api_key:
            return self._analyze_with_llm(
                title, description, duration_sec, tags, view_count, like_count, transcript
            )
        else:
            return self._analyze_heuristic(
                title, description, duration_sec, tags, view_count, like_count
            )

    def _analyze_with_llm(
        self,
        title: str,
        description: str,
        duration_sec: int,
        tags: list[str],
        view_count: int,
        like_count: int,
        transcript: str,
    ) -> list[ClipSegment]:
        """
        Use LLM (OpenAI) to identify viral segments.
        """
        try:
            from openai import OpenAI

            client = OpenAI(api_key=self.llm_api_key)
            prompt = f"""Analyze this YouTube video and identify the best 15-60 second clip segments
that would work for short-form viral content (TikTok, Reels, Shorts).

Title: {title}
Description: {description[:500]}
Duration: {duration_sec}s
Tags: {', '.join(tags[:10])}
Views: {view_count:,}
Likes: {like_count:,}
Transcript sample: {transcript[:1000] if transcript else "N/A"}

Return a JSON array of clip segments. Each object must have:
- "start_sec" (float): start time in seconds
- "end_sec" (float): end time in seconds
- "clip_type" (string): one of "hook", "peak_moment", "cta", "educational_insight"
- "confidence" (float 0-1): how likely this segment is to go viral
- "text_transcript" (string): what's said/ happening in this segment
- "reasoning" (string): why this segment would work as viral content

Return ONLY valid JSON, no markdown."""
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            content = resp.choices[0].message.content
            if not content:
                return []

            data = json.loads(content)
            segments_data = data.get("clips", data.get("segments", []))
            if not segments_data:
                # Try flat array
                if isinstance(data, list):
                    segments_data = data
                else:
                    segments_data = [data]

            segments: list[ClipSegment] = []
            for seg in segments_data:
                segments.append(ClipSegment(
                    video_id="",
                    start_sec=float(seg.get("start_sec", 0)),
                    end_sec=float(seg.get("end_sec", 60)),
                    clip_type=seg.get("clip_type", "hook"),
                    confidence=float(seg.get("confidence", 0.5)),
                    text_transcript=seg.get("text_transcript", ""),
                    reasoning=seg.get("reasoning", ""),
                ))
            return segments

        except Exception as e:
            logger.warning(f"LLM analysis failed: {e}. Falling back to heuristic.")
            return self._analyze_heuristic(
                title, description, duration_sec, tags, view_count, like_count
            )

    @staticmethod
    def _analyze_heuristic(
        title: str,
        description: str,
        duration_sec: int,
        tags: list[str],
        view_count: int,
        like_count: int,
    ) -> list[ClipSegment]:
        """
        Heuristic-based segment identification (no LLM needed).
        Uses title patterns, description structure, and engagement signals.
        """
        segments: list[ClipSegment] = []

        # 1) Hook detection — usually first 5-15% of video
        hook_start = 0
        hook_end = min(duration_sec * 0.15, 30)
        hook_confidence = 0.6
        # Boost confidence if title has "hook" keywords
        hook_keywords = ["you won't believe", "the truth", "secret", "insane",
                         "ultimate", "changed everything", "everyone", "this is"]
        if any(kw in title.lower() for kw in hook_keywords):
            hook_confidence = 0.85
        segments.append(ClipSegment(
            video_id="", start_sec=hook_start, end_sec=hook_end,
            clip_type="hook", confidence=hook_confidence,
            reasoning=f"Detected hook pattern in title: '{title[:60]}'",
        ))

        # 2) Peak moment — mid-to-late video, longer clip
        if duration_sec > 120:
            mid_point = duration_sec * 0.5
            peak_start = mid_point
            peak_end = min(mid_point + 45, duration_sec)
            peak_confidence = 0.55
            # Boost confidence for high-engagement videos
            if view_count > 100_000 and like_count > 0:
                like_ratio = like_count / view_count
                if like_ratio > 0.05:
                    peak_confidence = 0.7
            segments.append(ClipSegment(
                video_id="", start_sec=peak_start, end_sec=peak_end,
                clip_type="peak_moment", confidence=peak_confidence,
                reasoning=f"Mid-video peak segment (high engagement signal: {like_count:,} likes)",
            ))

        # 3) CTA / closing — last 10% of video
        cta_start = max(duration_sec * 0.9, duration_sec - 30)
        cta_end = duration_sec
        cta_keywords = ["subscribe", "like", "comment", "follow", "next video", "check out"]
        cta_confidence = 0.5
        if any(kw in description.lower() for kw in cta_keywords):
            cta_confidence = 0.65
        segments.append(ClipSegment(
            video_id="", start_sec=cta_start, end_sec=cta_end,
            clip_type="cta", confidence=cta_confidence,
            reasoning="End-of-video call-to-action segment",
        ))

        return segments


# ── Public API ─────────────────────────────────────────────────────────────

def analyze_video_for_clips(
    title: str,
    description: str,
    duration_sec: int,
    tags: list[str] | None = None,
    view_count: int = 0,
    like_count: int = 0,
    transcript: str = "",
    llm_key: str = "",
) -> list[dict[str, Any]]:
    """Analyze video and return clip segments as dicts."""
    analyzer = ContentAnalyzer(llm_key)
    segments = analyzer.analyze_video(title, description, duration_sec, tags, view_count, like_count, transcript)
    return [s.to_dict() for s in segments]


if __name__ == "__main__":
    clips = analyze_video_for_clips(
        title="The TRUTH about AI in 2025 (you won't believe)",
        description="In this video I reveal the shocking truth about AI...",
        duration_sec=600,
        tags=["ai", "technology", "future"],
        view_count=500_000,
        like_count=35_000,
    )
    print(json.dumps(clips, indent=2))