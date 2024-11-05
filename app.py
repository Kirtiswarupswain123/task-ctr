from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
import tensorflow as tf
import joblib

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the saved model, scaler, and label encoders
model = tf.keras.models.load_model('model.h5')
scaler = joblib.load('scaler.pkl')
label_encoders = joblib.load('label_encoders.pkl')

# Prediction function
def predict_ctr(inputs):
    # Helper function to transform input with error handling
    def safe_transform(label_encoder, value, field_name):
        try:
            return label_encoder.transform([value])[0]
        except ValueError:
            raise ValueError(f"Invalid value '{value}' for field '{field_name}'")

    # Transform input data with validation
    input_data = pd.DataFrame([[
        inputs['time_of_checking'],
        safe_transform(label_encoders['Preferred Messaging Channel'], inputs['messaging_channel'], 'messaging_channel'),
        safe_transform(label_encoders['Language Preferred'], inputs['language'], 'language'),
        safe_transform(label_encoders['Type of CTA'], inputs['cta_type'], 'cta_type'),
        safe_transform(label_encoders['City'], inputs['city'], 'city'),
        safe_transform(label_encoders['Type of Device'], inputs['device_type'], 'device_type')
    ]], columns=['Time of Checking Messages', 'Preferred Messaging Channel', 'Language Preferred', 'Type of CTA', 'City', 'Type of Device'])

    # Standardize and predict
    input_data_scaled = scaler.transform(input_data)
    prediction = model.predict(input_data_scaled)[0][0]
    return prediction


# Root route
@app.route('/')
def home():
    return "Welcome to the CTR Prediction API"

# API route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    prediction = predict_ctr(data)
    return jsonify({'prediction': float(prediction)})

if __name__ == '__main__':
    app.run(debug=True)
