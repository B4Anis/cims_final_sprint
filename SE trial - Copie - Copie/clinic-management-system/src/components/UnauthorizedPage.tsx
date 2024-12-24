import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1>Access Denied</h1>
            <p>Sorry, you don't have permission to access this page.</p>
            {user && (
                <p>Current role: {user.role}</p>
            )}
            <button
                onClick={() => navigate(-1)}
                style={{
                    padding: '10px 20px',
                    marginTop: '20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Go Back
            </button>
        </div>
    );
};

export default UnauthorizedPage;
