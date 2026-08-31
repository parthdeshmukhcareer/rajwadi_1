import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Tag, 
  MessageSquare,
  CreditCard,
  RotateCcw,
  Layers,
  Box
} from 'lucide-react';
import './components.css'; // We will create this for component-specific styles

const Sidebar = ({ isCollapsed }) => {
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { 
      name: 'Catalogue', 
      isHeader: true,
      children: [
        { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
        { name: 'Categories', path: '/admin/categories', icon: <Layers size={20} /> },
        { name: 'Inventory', path: '/admin/inventory', icon: <Box size={20} /> },
      ]
    },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    {
      name: 'Marketing',
      isHeader: true,
      children: [
        { name: 'Coupons', path: '/admin/coupons', icon: <Tag size={20} /> },
        { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquare size={20} /> },
      ]
    },
    {
      name: 'Finance',
      isHeader: true,
      children: [
        { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
        { name: 'Refunds', path: '/admin/refunds', icon: <RotateCcw size={20} /> },
      ]
    },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-header" style={{ padding: '0 20px' }}>
        <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          {isCollapsed ? (
            <span style={{ color: 'var(--admin-secondary)', fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--admin-font-heading)' }}>R</span>
          ) : (
            <img 
              src="https://www.rajwadi.com/static/version1780378735/frontend/Aureatelabs/rajwadi/en_US/images/logo.svg" 
              alt="Rajwadi Admin Logo" 
              style={{ 
                height: '35px', 
                width: 'auto', 
                maxWidth: '100%',
                filter: 'brightness(0) invert(0.95) sepia(0.3) hue-rotate(345deg) saturate(1.2)'
              }} 
            />
          )}
        </NavLink>
      </div>
      
      <nav className="admin-sidebar-nav">
        {navItems.map((item, index) => {
          if (item.isHeader) {
            return (
              <div key={index} className="admin-nav-group">
                {!isCollapsed && <div className="admin-nav-header">{item.name}</div>}
                {item.children.map((child, idx) => (
                  <NavLink 
                    key={idx} 
                    to={child.path}
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                    title={isCollapsed ? child.name : ''}
                  >
                    <span className="admin-nav-icon">{child.icon}</span>
                    {!isCollapsed && <span className="admin-nav-text">{child.name}</span>}
                  </NavLink>
                ))}
              </div>
            );
          }

          return (
            <NavLink 
              key={index} 
              to={item.path}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.name : ''}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="admin-nav-text">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
