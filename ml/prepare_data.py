"""
Prepare Kaggle (or other) CSV for training.
Converts various column names to the expected: query, label (0=safe, 1=malicious).

Usage:
  # After downloading "Prompt Injection in the Wild" from Kaggle, place the CSV in ml/data/raw/
  cd ml
  python prepare_data.py data/raw/prompt-injection-in-the-wild.csv

  # Or with custom input/output
  python prepare_data.py path/to/downloaded.csv --out data/raw/dataset.csv
"""
import os
import re
import argparse
import pandas as pd

# Column mapping: dataset column name -> our name
TEXT_COLUMNS = ("query", "text", "prompt", "content", "input", "message", "sentence")
LABEL_COLUMNS = ("label", "is_injection", "is_jailbreak", "target", "attack", "class", "category")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_RAW = os.path.join(BASE_DIR, "data", "raw")
DEFAULT_OUT = os.path.join(BASE_DIR, "data", "raw", "dataset.csv")


def find_column(df: pd.DataFrame, candidates: tuple) -> str:
    """Return first column name that exists (case-insensitive)."""
    cols_lower = {c.lower(): c for c in df.columns}
    for c in candidates:
        if c.lower() in cols_lower:
            return cols_lower[c.lower()]
    return None


def normalize_label(val) -> int:
    """Map label to 0 (safe) or 1 (malicious)."""
    if pd.isna(val):
        return 0
    if isinstance(val, (int, float)):
        return 1 if int(val) == 1 else 0
    s = str(val).lower().strip()
    if s in ("1", "true", "yes", "malicious", "injection", "attack", "jailbreak", "positive"):
        return 1
    return 0


def clean_text(text: str) -> str:
    if not isinstance(text, str):
        text = str(text)
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    return text


def prepare(
    in_path: str,
    out_path: str = DEFAULT_OUT,
    text_col: str = None,
    label_col: str = None,
    default_label: int | None = None,
) -> None:
    df = pd.read_csv(in_path)
    df.columns = [c.strip() for c in df.columns]

    query_col = text_col or find_column(df, TEXT_COLUMNS)
    label_col = label_col or find_column(df, LABEL_COLUMNS)

    if not query_col:
        raise ValueError(
            f"No text column found. Expected one of: {TEXT_COLUMNS}. "
            f"Your columns: {list(df.columns)}. Use --text-col <name> to specify."
        )
    if not label_col and default_label is None:
        raise ValueError(
            f"No label column found. Expected one of: {LABEL_COLUMNS}. "
            f"Your columns: {list(df.columns)}. Use --label-col <name> to specify, "
            f"or use --assume-label 0/1 to assign a constant label."
        )

    out_df = pd.DataFrame()
    out_df["query"] = df[query_col].fillna("").astype(str).apply(clean_text)

    if label_col:
        labels = df[label_col]
    else:
        # No label column present; fall back to a constant label
        labels = pd.Series(default_label, index=df.index)

    out_df["label"] = labels.apply(normalize_label)

    # Drop empty or duplicate rows
    out_df = out_df[out_df["query"].str.len() >= 2].drop_duplicates(subset=["query"])

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    out_df.to_csv(out_path, index=False)
    print(f"Prepared {len(out_df)} rows -> {out_path}")
    print(f"Label distribution:\n{out_df['label'].value_counts()}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prepare Kaggle CSV for CipherShield training")
    parser.add_argument("input", help="Path to downloaded CSV (e.g. from prompt-injection-in-the-wild)")
    parser.add_argument("--out", default=DEFAULT_OUT, help=f"Output path (default: {DEFAULT_OUT})")
    parser.add_argument("--text-col", help="Column name for text (auto-detected if not set)")
    parser.add_argument("--label-col", help="Column name for label (auto-detected if not set)")
    parser.add_argument(
        "--assume-label",
        type=int,
        choices=[0, 1],
        help="If set, use this constant label (0=safe, 1=malicious) when no label column exists.",
    )
    args = parser.parse_args()
    prepare(
        args.input,
        args.out,
        args.text_col,
        args.label_col,
        default_label=args.assume_label,
    )
