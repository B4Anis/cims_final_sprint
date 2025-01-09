import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            const user = await login(email, password);
            
            // If user is clinic admin, go to welcome page to choose department
            if (user.role === 'clinicadmin') {
                navigate('/');
            } else {
                // For department admin and department user, go directly to inventory
                // with their assigned department
                navigate('/inventory', { state: { department: user.department } });
            }
        } catch (err: any) {
            // Handle specific error messages from the backend
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Invalid email or password');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Welcome to CIMS</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};