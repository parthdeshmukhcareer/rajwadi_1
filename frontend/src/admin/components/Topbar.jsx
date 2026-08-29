import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

const Topbar = ({ toggleSidebar, isSidebarCollapsed }) => {
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
          <span className="admin-profile-name">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
