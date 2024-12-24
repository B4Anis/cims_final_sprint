import React, { useState } from 'react';
import { User, Department, UserRole } from '../../types/user.types';
import { UserTable } from './UserTable';
import { AddUserModal } from './AddUserModal';
import { ActivityModal } from './ActivityModal';
import './UserManagement.css';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleAddUser = (newUser: Omit<User, 'id'>) => {
        const user: User = {
            ...newUser,
            id: Date.now().toString(),
            status: 'active'
        };
        setUsers([...users, user]);
        setIsAddModalOpen(false);
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    const handleViewActivity = (user: User) => {
        setSelectedUser(user);
        setIsActivityModalOpen(true);
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log('Filtered Users:', filteredUsers);
    console.log('Rendering User Management');

    return (
        <div className="user-management">
            <div className="page-header">
                <div>
                    <div className="breadcrumb">Home {'>'} Permissions & Accounts {'>'} User Management</div>
                    <h1>User Management</h1>
                </div>
            </div>

            <div className="controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <button 
                    className="add-user-btn"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add User
                </button>
            </div>

            <UserTable
                users={filteredUsers}
                onDelete={handleDeleteUser}
                onViewActivity={handleViewActivity}
            />

            {isAddModalOpen && (
                <>
                    {console.log('Rendering AddUserModal')}
                    <AddUserModal
                        onClose={() => setIsAddModalOpen(false)}
                        onSubmit={handleAddUser}
                    />
                </>
            )}

            {isActivityModalOpen && selectedUser && (
                <>
                    {console.log('Rendering ActivityModal')}
                    <ActivityModal
                        user={selectedUser}
                        onClose={() => {
                            setIsActivityModalOpen(false);
                            setSelectedUser(null);
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default UserManagement;
