#!/usr/bin/env python3
"""
ViralForge — Content Intelligence Pipeline CLI
Run: python -m ai_pipeline.pipeline
"""

import json
import sys

from ai_pipeline.pipeline import generate_daily_picks, run_pipeline


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="ViralForge AI Content Pipeline")
    parser.add_argument(
        "command",
        choices=["scan", "daily-picks", "full"],
        help="Pipeline command to run",
    )
    parser.add_argument(
        "--niches", "-n",
        nargs="+",
        default=["tech", "comedy", "gaming", "education"],
        help="Niches to scan (default: tech comedy gaming education)",
    )
    parser.add_argument(
        "--count", "-c",
        type=int,
        default=10,
        help="Number of daily picks (default: 10)",
    )
    parser.add_argument(
        "--output", "-o",
        default="",
        help="Output JSON file path",
    )
    parser.add_argument(
        "--pretty", "-p",
        action="store_true",
        help="Pretty-print output JSON",
    )

    args = parser.parse_args()

    if args.command == "scan":
        results = run_pipeline(niches=args.niches, output_file=args.output)
    elif args.command == "daily-picks":
        results = generate_daily_picks(
            niches=args.niches, count=args.count, output_file=args.output
        )
    else:
        results = run_pipeline(niches=args.niches, output_file=args.output)

    if not args.output:
        indent = 2 if args.pretty else None
        print(json.dumps(results, indent=indent))


if __name__ == "__main__":
    main()