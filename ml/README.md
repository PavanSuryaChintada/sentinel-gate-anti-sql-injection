# ML Module — Prompt Injection Classifier

This module adds a machine learning layer on top of the existing rule-based SQL injection detection in SentinelGate. While `sentinel-gate.js` catches known patterns, this classifier catches **unknown and obfuscated injections** that slip through regex rules.

## How It Works

1. User input is passed to the classifier
2. Text is cleaned and vectorized (TF-IDF)
3. Model returns a confidence score: `safe` or `malicious`
4. If flagged, the request is blocked before hitting the backend

## Folder Structure

```
ml/
├── data/
│   ├── raw/          ← original datasets (CSV)
│   └── processed/    ← cleaned, tokenized data
├── models/           ← saved .pkl model files
├── notebooks/
│   └── exploration.ipynb
├── src/
│   ├── preprocess.py ← text cleaning
│   ├── train.py      ← model training
│   └── predict.py    ← inference / API-ready function
└── requirements.txt
```

## Setup

```bash
pip install -r ml/requirements.txt
```

## Train the Model

```bash
python ml/src/train.py
```

This will save the trained model to `ml/models/classifier.pkl`.

## Run Inference

```python
from ml.src.predict import predict

result = predict("SELECT * FROM users WHERE id = 1 OR 1=1")
print(result)  # {'label': 'malicious', 'confidence': 0.97}
```

## Dataset

Place your raw dataset CSV in `ml/data/raw/`. Expected columns:
- `query` — the input text
- `label` — `1` for malicious, `0` for safe

Recommended datasets:
- [Kaggle SQL Injection Dataset](https://www.kaggle.com/datasets/sajid576/sql-injection-dataset)
- Manually collected examples
