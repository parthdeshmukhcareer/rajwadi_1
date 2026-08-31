import React, { useState } from 'react';
import { reportService } from '../services/report.service';
import { generateDashboardReportPdf } from '../utils/pdfGenerator';
import { X } from 'lucide-react';
import './components.css'; // Adjust import if needed

const ReportGeneratorModal = ({ isOpen, onClose }) => {
  const [range, setRange] = useState('last_30_days');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);
    
    try {
      const data = await reportService.getSalesReport({ range });
      generateDashboardReportPdf(data);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Report Generation Error:", err);
      const errorMsg = err?.error?.message || err?.message || (typeof err === 'object' ? JSON.stringify(err) : err.toString());
      setError(`Failed to generate report: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="admin-modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 9999
    }}>
      <div className="admin-modal-content admin-card" style={{
        width: '400px', backgroundColor: '#fff', borderRadius: '8px', padding: '24px', position: 'relative'
      }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
        >
          <X size={20} />
        </button>
        
        <h2 style={{ color: 'var(--admin-primary)', marginBottom: '16px', fontSize: '20px' }}>Generate Detailed Report</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#444' }}>Select Time Frame</label>
          <select 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            disabled={isGenerating}
          >
            <option value="last_30_days">Last 30 Days (Rolling)</option>
            <option value="last_month">Previous Calendar Month</option>
            <option value="last_6_months">Last 6 Months</option>
            <option value="ytd">This Year (Year to Date)</option>
            <option value="all_time">All Time</option>
          </select>
        </div>

        {error && <div style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {success && <div style={{ color: '#2e7d32', marginBottom: '16px', fontSize: '14px' }}>Report generated successfully!</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            className="admin-btn admin-btn-outline" 
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button 
            className="admin-btn admin-btn-primary" 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneratorModal;
