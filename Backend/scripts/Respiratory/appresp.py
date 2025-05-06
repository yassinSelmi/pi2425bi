from flask import Flask, request, jsonify
import numpy as np
import librosa
from tensorflow import keras
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
model = keras.models.load_model('Resp.h5')

classes = ["COPD", "Bronchiolitis", "Pneumoina", "URTI", "Healthy"]

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        audio_bytes = file.read()

        audio_data, samplerate = librosa.load(io.BytesIO(audio_bytes), sr=None)

        if audio_data.ndim > 1:
            audio_data = audio_data[:, 0]

        audio_data = librosa.effects.time_stretch(audio_data, rate=1.2)

        mfccs = np.mean(librosa.feature.mfcc(y=audio_data, sr=samplerate, n_mfcc=52).T, axis=0)

        features = mfccs.reshape(1, 52)
        val = np.expand_dims(features, axis=1)  # shape: (1, 1, 52)

        prediction = model.predict(val)
        predicted_class = classes[np.argmax(prediction[0])]
        confidence = float(prediction[0].max())

        return jsonify({'prediction': predicted_class, 'confidence': confidence})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True,port=5008)
