"""
AI Post / Content Generator
Generates caption ideas, thumbnail concepts, and hashtag sets
inspired by current trending content in each niche.
"""

import json
import logging
import os
import random
from typing import Any

logger = logging.getLogger(__name__)


# ── Trending Post Model ─────────────────────────────────────────────────────

class GeneratedPost:
    """AI-generated post recommendation with caption, hashtags, and thumbnail concept."""

    def __init__(
        self,
        source_video_id: str,
        niche: str,
        captions: list[str],
        hashtags: list[str],
        thumbnail_concept: str,
        platform_recommendations: list[str],
        post_type: str = "clip",  # "clip", "meme", "text_post"
    ) -> None:
        self.source_video_id = source_video_id
        self.niche = niche
        self.captions = captions
        self.hashtags = hashtags
        self.thumbnail_concept = thumbnail_concept
        self.platform_recommendations = platform_recommendations
        self.post_type = post_type

    def to_dict(self) -> dict[str, Any]:
        return {
            "source_video_id": self.source_video_id,
            "niche": self.niche,
            "captions": self.captions,
            "hashtags": self.hashtags,
            "thumbnail_concept": self.thumbnail_concept,
            "platform_recommendations": self.platform_recommendations,
            "post_type": self.post_type,
        }


# ── Generator ──────────────────────────────────────────────────────────────

class PostGenerator:
    """
    Generates post content (captions, hashtags, thumbnails)
    inspired by trending content patterns.
    """

    # Niche-specific templates
    CAPTION_TEMPLATES = {
        "gaming": [
            "This {moment} was INSANE 😱",
            "POV: You just hit the {achievement}",
            "The {mechanic} is BROKEN in {game}",
            "Only 1% of players know this {secret}",
        ],
        "tech": [
            "This {tool} changes EVERYTHING 🚀",
            "I tested {tool} so you don't have to",
            "The {concept} explained in 60 seconds",
            "Why everyone is switching to {tool}",
        ],
        "comedy": [
            "POV: {situation} 🤣",
            "The accuracy though 💀",
            "This is EXACTLY how it feels when {situation}",
        ],
        "education": [
            "{fact} will surprise you 🧠",
            "The science behind {concept} explained",
            "{number} things you didn't know about {topic}",
        ],
        "default": [
            "Wait for it... 🔥",
            "The {thing} you NEED to see today",
            "This changes everything 🤯",
            "Tag someone who needs to see this 👇",
        ],
    }

    HASHTAG_SETS = {
        "gaming": ["#gaming", "#gamer", "#fyp", "#gamingcommunity", "#gameplay", "#shorts"],
        "tech": ["#tech", "#technology", "#ai", "#future", "#innovation", "#programming"],
        "comedy": ["#comedy", "#funny", "#memes", "#lol", "#humor", "#viral"],
        "education": ["#education", "#learning", "#facts", "#knowledge", "#science", "#didyouknow"],
        "default": ["#viral", "#trending", "#fyp", "#foryou", "#viralvideo"],
    }

    PLATFORM_RANKING = ["tiktok", "youtube_shorts", "instagram_reels", "twitter"]

    def __init__(self, llm_api_key: str | None = None) -> None:
        self.llm_api_key = llm_api_key or os.getenv("OPENAI_API_KEY", "")

    def generate(
        self,
        source_video_id: str,
        niche: str,
        title: str = "",
        description: str = "",
        tags: list[str] | None = None,
        clip_segments: list[dict[str, Any]] | None = None,
        platform_fit: dict[str, float] | None = None,
    ) -> GeneratedPost:
        """
        Generate post content for a video/clip.
        Uses LLM if key available, otherwise templates.
        """
        tags = tags or []
        clip_segments = clip_segments or []

        if self.llm_api_key:
            return self._generate_with_llm(
                source_video_id, niche, title, description, tags, clip_segments
            )
        else:
            return self._generate_templated(
                source_video_id, niche, title, description, tags, clip_segments
            )

    def _generate_with_llm(
        self,
        source_video_id: str,
        niche: str,
        title: str,
        description: str,
        tags: list[str],
        clip_segments: list[dict[str, Any]],
    ) -> GeneratedPost:
        """Generate rich post content via LLM."""
        try:
            from openai import OpenAI

            client = OpenAI(api_key=self.llm_api_key)
            prompt = f"""You are a viral content strategist. Generate 3 caption ideas,
a set of 8 hashtags, a thumbnail concept, and platform recommendations
for a short-form video post.

Niche: {niche}
Source Video Title: {title}
Description: {description[:300]}
Tags: {', '.join(tags[:10])}

Return JSON with:
- "captions": list of 3 caption strings (each max 150 chars)
- "hashtags": list of 8 hashtags
- "thumbnail_concept": one-sentence description of thumbnail
- "platform_recommendations": list of platforms (choose from: tiktok, youtube_shorts, instagram_reels, twitter)
- "post_type": "clip", "meme", or "text_post"

Return ONLY valid JSON, no markdown."""

            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                response_format={"type": "json_object"},
            )
            content = resp.choices[0].message.content
            if not content:
                raise ValueError("Empty LLM response")

            data = json.loads(content)
            return GeneratedPost(
                source_video_id=source_video_id,
                niche=niche,
                captions=data.get("captions", ["Trending post — check it out!"]),
                hashtags=data.get("hashtags", ["#viral"]),
                thumbnail_concept=data.get("thumbnail_concept", "High-energy reaction shot"),
                platform_recommendations=data.get("platform_recommendations", ["tiktok", "youtube_shorts"]),
                post_type=data.get("post_type", "clip"),
            )

        except Exception as e:
            logger.warning(f"LLM generation failed: {e}. Falling back to templates.")
            return self._generate_templated(
                source_video_id, niche, title, description, tags, clip_segments
            )

    def _generate_templated(
        self,
        source_video_id: str,
        niche: str,
        title: str,
        description: str,
        tags: list[str],
        clip_segments: list[dict[str, Any]],
    ) -> GeneratedPost:
        """Generate content using templates (no LLM)."""
        templates = self.CAPTION_TEMPLATES.get(niche, self.CAPTION_TEMPLATES["default"])
        captions: list[str] = []
        for _ in range(3):
            template = random.choice(templates)
            # Simple fill-in with keywords from title
            caps = random.choice([5, 10, 15, 20, 30, 60])
            caption = template.replace("{moment}", "moment")
            caption = caption.replace("{achievement}", "new high score")
            caption = caption.replace("{mechanic}", "new feature")
            caption = caption.replace("{secret}", "hidden trick")
            caption = caption.replace("{tool}", title.split()[-1] if len(title.split()) > 1 else "this app")
            caption = caption.replace("{concept}", niche)
            caption = caption.replace("{situation}", "it happens")
            caption = caption.replace("{fact}", "This one fact")
            caption = caption.replace("{number}", "5")
            caption = caption.replace("{topic}", niche)
            caption = caption.replace("{thing}", f"{niche} trend")
            captions.append(caption)

        hashtags = self.HASHTAG_SETS.get(niche, self.HASHTAG_SETS["default"])[:]
        # Add niche tag
        hashtags.append(f"#{niche}")
        random.shuffle(hashtags)

        return GeneratedPost(
            source_video_id=source_video_id,
            niche=niche,
            captions=captions,
            hashtags=hashtags[:8],
            thumbnail_concept=f"Bold text overlay on screenshot from video with '{niche}' theme",
            platform_recommendations=self.PLATFORM_RANKING[:random.randint(2, 4)],
            post_type="clip",
        )


# ── Public API ─────────────────────────────────────────────────────────────

def generate_post(
    source_video_id: str,
    niche: str,
    title: str = "",
    description: str = "",
    tags: list[str] | None = None,
    clip_segments: list[dict[str, Any]] | None = None,
    llm_key: str = "",
) -> dict[str, Any]:
    """Generate post content for a video clip."""
    gen = PostGenerator(llm_key)
    post = gen.generate(source_video_id, niche, title, description, tags, clip_segments)
    return post.to_dict()


if __name__ == "__main__":
    post = generate_post(
        source_video_id="vid_001",
        niche="tech",
        title="I tried 50 AI tools so you don't have to",
        tags=["ai", "tech", "tools"],
    )
    print(json.dumps(post, indent=2))