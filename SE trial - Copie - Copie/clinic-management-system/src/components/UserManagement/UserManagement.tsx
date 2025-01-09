import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Department, UserRole } from '../../types/user.types';
import { UserTable } from './UserTable';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { ActivityModal } from './ActivityModal';
import './UserManagement.css';
import SidebarMenu from '../SidebarMenu';

interface ExtendedUser extends User {
    _id: string;
}

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<ExtendedUser[]>([]);
    const [error, setError] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
    const [category, setCategory] = useState<string>('user-manager');
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Only clinic admin can access this page
        if (currentUser?.role !== 'clinicadmin') {
            navigate('/unauthorized');
            return;
        }

        fetchUsers();
    }, [currentUser, navigate]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (response.data && Array.isArray(response.data)) {
                const formattedUsers: ExtendedUser[] = response.data.map((user: any) => ({
                    _id: user._id,
                    userID: user.userID,
                    fullName: user.fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber || 'N/A',
                    department: user.department as Department,
                    role: user.role as UserRole,
                    status: user.status || 'active', // Include status field with default
                    lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
                    activityLog: user.activityLog || []
                }));
                setUsers(formattedUsers);
            } else {
                console.error('Invalid response format:', response.data);
                setError('Invalid response format from server');
            }
        } catch (err: any) {
            console.error('Error fetching users:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to fetch users');
        }
    };
    

    const handleAddUser = async (userData: Omit<User, 'lastLogin' | 'activityLog'>) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data) {
                console.log('User added successfully:', response.data);
                await fetchUsers(); // Refresh the users list
                setIsAddModalOpen(false); // Close the modal
            }
        } catch (err: any) {
            console.error('Error adding user:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to add user');
        }
    };

    const handleUpdateUser = async (email: string, userData: Partial<User>) => {
        console.log('Updating user with email:', email);
        console.log('Update data:', userData);
        try {
            // First, find the user's ID using their email
            const users = await axios.get('http://localhost:5000/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const userToUpdate = users.data.find((user: User) => user.email === email);
            if (!userToUpdate) {
                throw new Error('User not found');
            }

            const response = await axios.put(
                `http://localhost:5000/api/users/${userToUpdate.userID}`,
                userData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Server response:', response.data);
            if (response.data) {
                console.log('User updated successfully:', response.data);
                await fetchUsers();
                setIsEditModalOpen(false);
                setSelectedUser(null);
            }
        } catch (err: any) {
            console.error('Full error object:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error message:', err.message);
            setError(err.response?.data?.message || 'Failed to update user');
            throw err;
        }
    };

    const handleDeleteUser = async (email: string) => {
        try {
            await axios.delete(`/api/users/${email}`);
            fetchUsers();
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const handleViewActivity = (user: User) => {
        const extendedUser = users.find(u => u.email === user.email);
        if (extendedUser) {
            setSelectedUser(extendedUser);
            setIsActivityModalOpen(true);
        }
    };

    const handleEdit = (user: User) => {
        const extendedUser = users.find(u => u.email === user.email);
        if (extendedUser) {
            setSelectedUser(extendedUser);
            setIsEditModalOpen(true);
        }
    };

    const filteredUsers = users.filter(
        user =>
            (user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (user.department?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    );

    const mapToBaseUser = (user: ExtendedUser): User => {
        const { _id, ...baseUser } = user;
        return baseUser;
    };

    return (
        <div className="user-management">
            <SidebarMenu onCategoryChange={setCategory} />
            <div className="page-header">
                <div>
                    <div className="breadcrumb">
                        Home {'>'} Permissions & Accounts {'>'} User Management
                    </div>
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
                    Add New User
                </button>
            </div>

            <UserTable
                users={filteredUsers.map(mapToBaseUser)}
                onDelete={handleDeleteUser}
                onEdit={handleEdit}
                onViewActivity={handleViewActivity}
            />

            {isAddModalOpen && (
                <AddUserModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmitSuccess={handleAddUser}
                />
            )}

            {isEditModalOpen && selectedUser && (
                <EditUserModal
                    user={mapToBaseUser(selectedUser)}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onSubmit={handleUpdateUser}
                />
            )}

            {isActivityModalOpen && selectedUser && (
                <ActivityModal
                    user={mapToBaseUser(selectedUser)}
                    onClose={() => {
                        setIsActivityModalOpen(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
};