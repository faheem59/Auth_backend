import React, { useState } from 'react';
import axios from 'axios';
import './Profileform.css'; 

const ProfileForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/createuser', formData);
            console.log('Form submitted successfully!', response.data);
            
        } catch (error) {
            console.error('Error submitting the form:', error);
            
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
            <br />
            <label>
                Phone:
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </label>
            <br />
            <label>
                Password:
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </label>
            <br />
            <label>
                Address:
                <textarea name="address" value={formData.address} onChange={handleChange} />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
    );
};

export default ProfileForm;
