import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleDepartmentSelect = (department: string) => {
        navigate('/medications/:family', { state: { department } });
    };

    return (
        <div className="welcome-container">
            <header className="header">
                <h1>Choose the department you want to manage</h1>
            </header>
            <div className="departments">
                <div className="department pharmacy" onClick={() => handleDepartmentSelect('pharmacy')}>
                    <button className="button">Pharmacy</button>
                </div>
                <div className="department dentistry" onClick={() => handleDepartmentSelect('dentistry')}>
                    <button className="button">Dentistry</button>
                </div>
                <div className="department laboratory" onClick={() => handleDepartmentSelect('laboratory')}>
                    <button className="button">Laboratory</button>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;