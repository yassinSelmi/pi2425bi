from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Autoriser toutes les origines

# Charger le modèle et le scaler
with open("model_and_scaler.pkl", "rb") as f:
    model, scaler = pickle.load(f)

@app.route('/')
def home():
    return "Backend Flask pour prédiction cardiaque - OK"

@app.route('/heart', methods=['POST'])
def predict():
    try:
        # Accepter uniquement JSON
        if not request.is_json:
            return jsonify({"message": "Le contenu doit être au format JSON"}), 415
            
        data = request.get_json()
        
        expected_keys = [
            'Age', 'Sex', 'ChestPain', 'RestingBloodPressure', 'Cholesterol',
            'FastingBloodSugar', 'RestingECG', 'MaxHeartRate', 'ExcerciseAngina',
            'OldPeak', 'STSlope', 'nMajorVessels', 'Thalium'
        ]

        # Vérification des champs
        missing_keys = [key for key in expected_keys if key not in data]
        if missing_keys:
            return jsonify({
                "message": f"Champs manquants: {', '.join(missing_keys)}",
                "missing_fields": missing_keys
            }), 400

        # Conversion des valeurs
        try:
            input_features = [float(data[key]) for key in expected_keys]
        except ValueError as e:
            return jsonify({
                "message": f"Valeur invalide: {str(e)}",
                "details": "Toutes les valeurs doivent être numériques"
            }), 400

        # Prédiction
        scaled_input = scaler.transform([input_features])
        prediction = model.predict(scaled_input)

        result = "⚠️ High Risk of Heart Disease" if prediction[0] == 1 else "✅ Low Risk of Heart Disease"
        return jsonify({
            "message": result,
            "prediction": int(prediction[0]),
            "input_features": input_features
        })

    except Exception as e:
        return jsonify({
            "message": f"Erreur serveur: {str(e)}",
            "type": type(e).__name__
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port=5003)