import React from 'react';
import { IndianRupee, ShoppingBag, Users, Package } from 'lucide-react';

const SkeletonCard = ({ icon }) => (
  <div className="admin-card stats-card" style={{ opacity: 0.7 }}>
    <div className="stats-header">
      <div style={{ width: '100px', height: '20px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
      <div className="stats-icon" style={{ opacity: 0.5 }}>{icon}</div>
    </div>
    <div style={{ width: '140px', height: '32px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px', marginTop: '12px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
    <div style={{ width: '120px', height: '16px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px', marginTop: '16px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
  </div>
);

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div style={{ width: '250px', height: '36px', backgroundColor: 'var(--admin-border)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        <div style={{ width: '140px', height: '40px', backgroundColor: 'var(--admin-border)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
      </div>

      <div className="stats-grid">
        <SkeletonCard icon={<IndianRupee size={24} />} />
        <SkeletonCard icon={<ShoppingBag size={24} />} />
        <SkeletonCard icon={<Users size={24} />} />
        <SkeletonCard icon={<Package size={24} />} />
      </div>

      <div className="charts-grid">
        <div className="admin-card chart-card" style={{ height: '370px' }}>
          <div style={{ width: '200px', height: '24px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out', marginBottom: '24px' }}></div>
          <div style={{ width: '100%', height: '260px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        </div>
        <div className="admin-card chart-card" style={{ height: '370px' }}>
          <div style={{ width: '200px', height: '24px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out', marginBottom: '24px' }}></div>
          <div style={{ width: '100%', height: '260px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        </div>
      </div>

      <div className="admin-card recent-orders-section">
        <div className="section-header">
          <div style={{ width: '200px', height: '28px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i}><div style={{ width: '80%', height: '20px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j}><div style={{ width: '90%', height: '20px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default DashboardSkeleton;
