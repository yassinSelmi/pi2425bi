#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import os
# Must set these before any transformers import
os.environ["USE_TF"] = "0"
os.environ["TRANSFORMERS_NO_TF"] = "1"

from flask import Flask, request, jsonify, render_template
import torch
import pickle
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# 1. Load BERT model & tokenizer
MODEL_DIR = "checkpoint-188"
model     = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model.eval()

# 2. Load label mapping
with open("label_mapping.json", "r") as f:
    idx2label = json.load(f)

# 3. Load the TF-IDF vectorizer you fit earlier
with open("tfidf_vectorizer.pkl", "rb") as f:
    tfidf: TfidfVectorizer = pickle.load(f)
feature_names = tfidf.get_feature_names_out()

def extract_keywords(text: str, top_k: int = 5) -> str:
    vec  = tfidf.transform([text]).toarray()[0]
    idxs = vec.argsort()[-top_k:][::-1]
    return ";".join(feature_names[i] for i in idxs)

# 4. Serve the HTML form
@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

# 5. Prediction endpoint
@app.route("/predict", methods=["POST"])
def predict():
    data   = request.json
    sample = data["sample_name"].strip()
    desc   = data["description"].strip()

    # Automatically extract the keywords segment
    keys   = extract_keywords(desc)

    # Build the text exactly as in training:
    text   = f"{sample} [SEP] {desc} [SEP] {keys}"

    inputs = tokenizer(
        text,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=256
    )
    with torch.no_grad():
        logits = model(**inputs).logits

    pred_id   = int(torch.argmax(logits, dim=-1))
    specialty = idx2label[str(pred_id)]
    return jsonify({"specialty": specialty})

if __name__ == "__main__":
    app.run(host="0.0.0.0",  debug=True ,port=5012  )




