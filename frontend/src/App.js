import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    // Define the state for form inputs and prediction
    const [inputs, setInputs] = useState({
        time_of_checking: '',
        messaging_channel: '',
        language: '',
        cta_type: '',
        city: '',
        device_type: ''
    });
    const [prediction, setPrediction] = useState(null);

    // Dropdown options for each field
    const timeOptions = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours
    const messagingChannels = ["WhatsApp", "Email", "SMS"];
    const languages = ["English", "Chinese", "German"];
    const ctaTypes = ["book now", "know more", "purchase now", "order now"];
    const cities = ["London", "Toronto", "Paris", "Sydney"];
    const deviceTypes = ["Android", "iOS"];

    // Handle change in dropdown
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', inputs);
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error("Error making prediction:", error);
        }
    };

    return (
        <div className="App">
            <h2>CTR Prediction</h2>
            <form onSubmit={handleSubmit} className="prediction-form">
                <label>Time of Checking (Hour):</label>
                <select name="time_of_checking" onChange={handleChange} required>
                    <option value="">Select Hour</option>
                    {timeOptions.map(time => (
                        <option key={time} value={time}>{time}:00</option>
                    ))}
                </select>

                <label>Messaging Channel:</label>
                <select name="messaging_channel" onChange={handleChange} required>
                    <option value="">Select Channel</option>
                    {messagingChannels.map(channel => (
                        <option key={channel} value={channel}>{channel}</option>
                    ))}
                </select>

                <label>Language:</label>
                <select name="language" onChange={handleChange} required>
                    <option value="">Select Language</option>
                    {languages.map(language => (
                        <option key={language} value={language}>{language}</option>
                    ))}
                </select>

                <label>CTA Type:</label>
                <select name="cta_type" onChange={handleChange} required>
                    <option value="">Select CTA Type</option>
                    {ctaTypes.map(cta => (
                        <option key={cta} value={cta}>{cta}</option>
                    ))}
                </select>

                <label>City:</label>
                <select name="city" onChange={handleChange} required>
                    <option value="">Select City</option>
                    {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>

                <label>Device Type:</label>
                <select name="device_type" onChange={handleChange} required>
                    <option value="">Select Device Type</option>
                    {deviceTypes.map(device => (
                        <option key={device} value={device}>{device}</option>
                    ))}
                </select>

                <button type="submit">Predict CTR</button>
            </form>
            {prediction !== null && (
                <div className="result">
                    <h3>Predicted CTR: {prediction.toFixed(2)}</h3>
                </div>
            )}
        </div>
    );
}

export default App;
