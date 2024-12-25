import React, { useState } from 'react';
import axios from 'axios';
import { User, Department, UserRole } from '../../types/user.types';
import './UserManagement.css';

interface AddUserModalProps {
    onClose: () => void;
    onSubmitSuccess: (newUser: User) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        department: 'pharmacy' as Department,
        role: 'department user' as UserRole,
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        // Validate full name
        if (formData.fullName.length < 3) {
            throw new Error('Full name must be at least 3 characters long');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Please enter a valid email address');
        }

        // Validate phone number (accepts formats: 1234567890, 123-456-7890, +1234567890)
        const phoneRegex = /^(\+\d{1,3}[-.]?)?\d{3}[-.]?\d{3}[-.]?\d{4}$/;
        if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
            throw new Error('Please enter a valid phone number');
        }

        // Validate password
        if (formData.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        
        // Check password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        }
    };

    const generateUserID = (department: Department, role: UserRole) => {
        const prefix = department.substring(0, 3).toUpperCase();
        const rolePrefix = role === 'department admin' ? 'ADM' : 'USR';
        const timestamp = Date.now().toString().slice(-6);
        return `${prefix}${rolePrefix}${timestamp}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Validate form data
            validateForm();

            const userDataWithId = {
                ...formData,
                userID: generateUserID(formData.department, formData.role),
                password: formData.password
            };

            const response = await axios.post('http://localhost:5000/api/auth/register', userDataWithId, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                console.log('User added successfully:', response.data);
                onSubmitSuccess(response.data);
                onClose();
            }
        } catch (err: any) {
            console.error('Error adding user:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to add user';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null); // Clear error when user makes changes
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name:</label>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            minLength={3}
                            placeholder="Enter full name (min 3 characters)"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email"
                            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            placeholder="Enter phone number (e.g., 123-456-7890)"
                            pattern="(\+\d{1,3}[-.]?)?\d{3}[-.]?\d{3}[-.]?\d{4}"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            placeholder="Enter password (min 8 characters)"
                        />
                        <small className="password-requirements">
                            Password must contain at least 8 characters, including uppercase, lowercase, number, and special character
                        </small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">Department:</label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >
                            <option value="pharmacy">Pharmacy</option>
                            <option value="dentistry">Dentistry</option>
                            <option value="laboratory">Laboratory</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="department admin">Department Admin</option>
                            <option value="department user">Department User</option>
                        </select>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="modal-actions">
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add User'}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};