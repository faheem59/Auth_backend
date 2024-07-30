import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Otp.css';


const Otp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 

    const handleSendOTP = async () => {
        setLoading(true); 
        try {
            const response = await axios.post('http://localhost:5000/api/create', { email });
            setMessage(response.data.message);
        } catch (error) {
            setError('Failed to send OTP');
        } finally {
            setLoading(false); 
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true); 
        try {
            const response = await axios.post('http://localhost:5000/api/verify', { email, otp });
            setMessage(response.data.message);
            navigate('/detail')
        } catch (error) {
            setError('Failed to verify OTP');
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="container">
            <h1>OTP Verification</h1>
            {message && <div className="message">{message}</div>}
            {error && <div className="error">{error}</div>}
            <div className="form">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button onClick={handleSendOTP} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>

                <label>Enter OTP:</label>
                <input type="text" value={otp} onChange={(e) => setOTP(e.target.value)} required />
                <button onClick={handleVerifyOTP} disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            </div>
        </div>
    );
};

export default Otp;
