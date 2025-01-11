import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaMedkit, FaStethoscope, FaFlask, FaBoxes, FaUsers, FaChevronDown, FaChevronRight, FaBell, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import './SidebarMenu.css';
import ProfileCard from './ProfileCard';
import profilePic from '../assets/profile-pic.jpg';
import { useAuth } from '../context/AuthContext';

interface SidebarMenuProps {
    onCategoryChange?: (category: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onCategoryChange }) => {
    const [isMedicationsOpen, setIsMedicationsOpen] = useState(true);
    const medicationFamilies = ['Family1', 'Family 2', 'Family 3', 'Family 4'];
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (location.pathname.includes('medications')) {
            setIsMedicationsOpen(true);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="profile-section">
                {/* Back arrow to navigate to Departments */}
                {user?.role === 'clinicadmin' && (
                    <Link to="/departments" className="back-arrow">
                        <FaArrowLeft size={20} />
                    </Link>
                )}
                <ProfileCard 
                    imageUrl={profilePic} 
                    username={user?.fullName || "User"} 
                    role={user?.department ? `${user.department} ${user?.role?.replace('Department ', '')}` : user?.role || ""}
                />
            </div>

            <div className="menu">
                <div className="menu-item-group">
                    <div 
                        className="menu-item"
                        onClick={() => setIsMedicationsOpen(!isMedicationsOpen)}
                    >
                        <div className="menu-item-header">
                            <FaMedkit />
                            <span>Medications</span>
                            {isMedicationsOpen ? <FaChevronDown /> : <FaChevronRight />}
                        </div>
                    </div>
                    {isMedicationsOpen && (
                        <div className="submenu">
                            {medicationFamilies.map(family => (
                                <Link 
                                    key={family}
                                    to={`/medications/${family.toLowerCase().replace(' ', '-')}`}
                                    className="submenu-item"

                                >
                                    <span>{family}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <Link 
                    to="/instruments" 
                    className="menu-item"
                    onClick={() => onCategoryChange?.('Instruments')}
                >
                    <FaStethoscope />
                    <span>Instruments</span>
                </Link>
                <Link 
                    to="/inox" 
                    className="menu-item"
                    onClick={() => onCategoryChange?.('Inox')}
                >
                    <FaFlask />
                    <span>Inox</span>
                </Link>
                <Link 
                    to="/consumables" 
                    className="menu-item"
                >
                    <FaBoxes />
                    <span>Consumables</span>
                </Link>
                <Link 
                    to="/non-consumables" 
                    className="menu-item"
                    onClick={() => onCategoryChange?.('Non-Consumables')}
                >
                    <FaBoxes />
                    <span>Non-Consumables</span>
                </Link>
                {user?.role === 'clinicadmin' && (
                    <Link 
                        to="/user-management" 
                        className="menu-item"
                    >
                        <FaUsers />
                        <span>Manage Users</span>
                    </Link>
                )}
                <Link 
                    to="/notifications" 
                    className="menu-item"
                >
                    <FaBell />
                    <span>Notifications</span>
                </Link>
            </div>

            <div className="logout-section">
    <button onClick={handleLogout} className="logout-button">
        <span className="logout-text">Logout</span>
        <FaSignOutAlt size={20} style={{ marginLeft: '12px' }} />
    </button>
</div>

        </div>
    );
};

export default SidebarMenu;
