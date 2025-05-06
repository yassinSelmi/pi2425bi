from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Autoriser les requêtes cross-origin

# Charger le modèle
model_pipeline = joblib.load('patient_survival.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        expected_keys = [
            "apache_4a_icu_death_prob",
            "apache_4a_hospital_death_prob",
            "ventilated_apache",
            "d1_spo2_min",
            "gcs_eyes_apache",
            "d1_sysbp_noninvasive_min",
            "d1_sysbp_min",
            "d1_heartrate_min",
            "d1_diasbp_min",
            "solid_tumor_with_metastasis"
        ]

        for key in expected_keys:
            if key not in data:
                return jsonify({'error': f'Missing value for {key}'}), 400

        input_data = {k: float(data[k]) for k in expected_keys}
        input_df = pd.DataFrame([input_data])

        prediction_prob = model_pipeline.predict_proba(input_df)[:, 1][0]
        prediction_class = model_pipeline.predict(input_df)[0]

        result = {
            'probability': f"{round(prediction_prob * 100, 2)}%",
            'class': "Survived" if prediction_class == 1 else "Did not survive"
        }

        return jsonify({'prediction': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port=5010)
