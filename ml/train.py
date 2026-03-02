import os
import pickle
import argparse
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

from preprocess import load_dataset

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "raw", "dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "classifier.pkl")


def train(data_path: str = DATA_PATH, model_path: str = MODEL_PATH):
    print(f"Loading dataset from: {data_path}")
    df = load_dataset(data_path)

    print(f"Dataset size: {len(df)} rows")
    print(f"Label distribution:\n{df['label'].value_counts()}\n")

    X = df["query"]
    y = df["label"]

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Pipeline: TF-IDF + Logistic Regression
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            analyzer="char_wb",   # character n-grams catch obfuscated injections
            ngram_range=(2, 4),
            max_features=10000,
            sublinear_tf=True
        )),
        ("clf", LogisticRegression(
            C=1.0,
            max_iter=1000,
            class_weight="balanced",
            random_state=42
        ))
    ])

    print("Training model...")
    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["safe", "malicious"]))

    # Save model
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    with open(model_path, "wb") as f:
        pickle.dump(pipeline, f)
    print(f"Model saved to: {model_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default=DATA_PATH, help="Path to dataset CSV")
    parser.add_argument("--model", default=MODEL_PATH, help="Where to save the model")
    args = parser.parse_args()

    train(args.data, args.model)
