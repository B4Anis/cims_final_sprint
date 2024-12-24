import React from 'react';
import { User } from '../../types/user.types';
import './UserManagement.css';

interface UserTableProps {
    users: User[];
    onDelete: (userId: string) => void;
    onViewActivity: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
    users,
    onDelete,
    onViewActivity
}) => {
    return (
        <div className="table-container">
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{user.name}</span>
                                </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`department-badge department-${user.department}`}>
                                    {user.department}
                                </span>
                            </td>
                            <td>
                                <span className={`role-badge role-${user.role}`}>
                                    {user.role.replace('_', ' ')}
                                </span>
                            </td>
                            <td>
                                <span className={`status-badge status-${user.status}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        className="action-btn edit"
                                        onClick={() => {/* Handle edit */}}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="action-btn view"
                                        onClick={() => onViewActivity(user)}
                                    >
                                        Activity
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => onDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
