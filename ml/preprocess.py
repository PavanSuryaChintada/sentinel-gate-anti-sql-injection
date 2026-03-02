import re
import pandas as pd


def clean_text(text: str) -> str:
    """
    Clean and normalize input text for the classifier.
    Lowercases, strips extra spaces, and normalizes common obfuscation tricks.
    """
    if not isinstance(text, str):
        text = str(text)

    # Lowercase
    text = text.lower()

    # Normalize URL encoding (e.g. %27 → ')
    text = re.sub(r'%([0-9a-fA-F]{2})', lambda m: chr(int(m.group(1), 16)), text)

    # Normalize hex encoding (e.g. 0x27 → ')
    text = re.sub(r'0x[0-9a-fA-F]+', lambda m: str(int(m.group(0), 16)), text)

    # Collapse multiple spaces/newlines
    text = re.sub(r'\s+', ' ', text).strip()

    return text


def load_dataset(filepath: str) -> pd.DataFrame:
    """
    Load a CSV dataset with 'query' and 'label' columns.
    label: 1 = malicious, 0 = safe
    """
    df = pd.read_csv(filepath)

    # Normalize column names
    df.columns = [c.strip().lower() for c in df.columns]

    if 'query' not in df.columns or 'label' not in df.columns:
        raise ValueError("Dataset must have 'query' and 'label' columns")

    df['query'] = df['query'].apply(clean_text)
    df = df.dropna(subset=['query', 'label'])
    df['label'] = df['label'].astype(int)

    return df


if __name__ == "__main__":
    # Quick test
    samples = [
        "SELECT * FROM users WHERE id = 1 OR 1=1 --",
        "What is the weather today?",
        "'; DROP TABLE users; --",
        "Show me my account balance",
    ]
    for s in samples:
        print(f"Original : {s}")
        print(f"Cleaned  : {clean_text(s)}")
        print()
