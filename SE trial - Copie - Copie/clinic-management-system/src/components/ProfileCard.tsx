import React from 'react';
import './ProfileCard.css';

interface ProfileCardProps {
  imageUrl: string;
  username: string;
  role?: string;
  department?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageUrl, username, role, department }) => {
  return (
    <div className="profile-container">
      <img src={imageUrl} alt="Profile Picture" className="profile-pic" />
      <div className="profile-info">
        <span className="username">{username}</span>
        {role && <span className="role">{role}</span>}
        {department && <span className="department">{department}</span>}
      </div>
    </div>
  );
};

export default ProfileCard;