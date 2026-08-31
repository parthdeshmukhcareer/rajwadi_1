import React from 'react';
import { Menu, Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/account');
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button onClick={toggleSidebar} className="admin-icon-btn">
          <Menu size={24} />
        </button>
        
        <div className="admin-search-container">
          <Search size={18} className="admin-search-icon" />
          <input 
            type="text" 
            placeholder="Search products, orders, customers..." 
            className="admin-search-input"
          />
        </div>
      </div>
      
      <div className="admin-topbar-right">
        <button className="admin-icon-btn relative">
          <Bell size={20} />
          <span className="admin-notification-dot"></span>
        </button>
        
        <div className="admin-profile-menu">
          <div className="admin-avatar">
            <User size={20} />
          </div>
          <span className="admin-profile-name">{user?.firstName || 'Admin User'}</span>
        </div>

        <button 
          onClick={handleLogout} 
          className="admin-icon-btn" 
          title="Sign out"
          style={{ marginLeft: '8px' }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
