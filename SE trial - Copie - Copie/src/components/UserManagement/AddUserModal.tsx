import React, { useState } from 'react';
import { User, Department, UserRole } from '../../types/user.types';
import './UserManagement.css';

interface AddUserModalProps {
    onClose: () => void;
    onSubmit: (user: Omit<User, 'id'>) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: 'dentist' as Department,
        role: 'department_user' as UserRole,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            status: 'active'
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Add New User</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <select
                            id="department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                        >
                            <option value="dentist">Dentist</option>
                            <option value="laboratory">Laboratory</option>
                            <option value="emergencies">Emergencies</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                        >
                            <option value="department_admin">Department Admin</option>
                            <option value="department_user">Department User</option>
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
