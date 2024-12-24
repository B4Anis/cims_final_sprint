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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const userDataWithId = {
                ...formData,
                userID: `USER${Date.now()}`, // Generate a unique userID
                password: formData.password // Make sure password is included
            };

            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters long.');
                setIsLoading(false);
                return;
            }

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
            setError(`Failed to add user: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({

            ...prev,
            [e.target.name]: e.target.value
        }));
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
                            placeholder="Enter full name"
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
                            placeholder="Enter phone number"
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