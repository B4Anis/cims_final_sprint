import React, { useState } from 'react';
import { User, Department, UserRole } from '../../types/user.types';
import './UserManagement.css';

interface EditUserModalProps {
    user: User;
    onClose: () => void;
    onSubmit: (email: string, updatedUser: Partial<User>) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        department: user.department,
        role: user.role,
        status: user.status || 'active', 
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
        try {
            // Remove the email from formData since we're passing it separately
            const { email, ...updateData } = formData;
            console.log('Calling onSubmit with:', user.email, updateData);
            await onSubmit(user.email, updateData);
            console.log('Submit successful, closing modal');
            onClose(); // Close the modal after successful submission
        } catch (error) {
            console.error('Error in form submission:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log('Field changed:', name, value);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name:</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Department:</label>
                        <select
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
                        <label>Role:</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="clinicadmin">Clinic Admin</option>
                            <option value="department admin">Department Admin</option>
                            <option value="department user">Department User</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                        <button type="submit" className="save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
