import React, { useState } from 'react';
import { User } from '../../types/user.types';
import './UserManagement.css';

interface UserTableProps {
  users: User[];
  onDelete: (email: string) => void;
  onEdit: (user: User) => void;
  onViewActivity: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onDelete, onEdit, onViewActivity }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of rows per page

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th> {/* New column for status */}
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.userID}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.department}</td>
              <td>{user.role}</td>
              <td>{user.status}</td> {/* Render the user's status */}
              <td>
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
              </td>
              <td className="action-buttons">
                <button
                  className="action-btn edit-btn"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="action-btn view-btn"
                  onClick={() => onViewActivity(user)}
                >
                  Activity
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
    </div>
  );
};
