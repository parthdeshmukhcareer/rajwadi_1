import React, { useState, useEffect } from 'react';
import { Edit, Plus, Check, X } from 'lucide-react';
import { couponService } from '../services/coupon.service';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minimumOrderAmount: '',
    maximumDiscountAmount: '',
    usageLimit: '',
    startsAt: '',
    expiresAt: ''
  });
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const data = await couponService.getCoupons();
      setCoupons(Array.isArray(data) ? data : data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load coupons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = (coupon = null) => {
    setFormError(null);
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount || '',
        maximumDiscountAmount: coupon.maximumDiscountAmount || '',
        usageLimit: coupon.usageLimit || '',
        startsAt: coupon.startsAt ? new Date(coupon.startsAt).toISOString().slice(0, 16) : '',
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : ''
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minimumOrderAmount: '',
        maximumDiscountAmount: '',
        usageLimit: '',
        startsAt: '',
        expiresAt: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await couponService.toggleCouponStatus(id, !currentStatus);
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    const discountValue = parseInt(formData.discountValue, 10);
    if (isNaN(discountValue) || discountValue < 0) {
      return setFormError('Discount value must be positive');
    }
    if (formData.discountType === 'PERCENTAGE' && discountValue > 100) {
      return setFormError('Percentage discount cannot exceed 100');
    }
    
    if (formData.startsAt && formData.expiresAt && new Date(formData.expiresAt) <= new Date(formData.startsAt)) {
      return setFormError('Expiry date must be after start date');
    }

    const payload = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: discountValue,
      minimumOrderAmount: formData.minimumOrderAmount ? parseInt(formData.minimumOrderAmount, 10) : null,
      maximumDiscountAmount: formData.maximumDiscountAmount ? parseInt(formData.maximumDiscountAmount, 10) : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
      startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
    };

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon.id, payload);
      } else {
        await couponService.createCoupon(payload);
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      setFormError(err.message || 'Failed to save coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Code', cell: (row) => <strong style={{ fontFamily: 'monospace' }}>{row.code}</strong> },
    { header: 'Type', cell: (row) => row.discountType },
    { header: 'Value', cell: (row) => row.discountType === 'PERCENTAGE' ? `${row.discountValue}%` : `₹${row.discountValue}` },
    { header: 'Min Order', cell: (row) => row.minimumOrderAmount ? `₹${row.minimumOrderAmount}` : '-' },
    { header: 'Max Discount', cell: (row) => row.maximumDiscountAmount ? `₹${row.maximumDiscountAmount}` : '-' },
    { header: 'Usage', cell: (row) => `${row.timesUsed} / ${row.usageLimit || '∞'}` },
    { header: 'Expiry', cell: (row) => row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : 'Never' },
    { 
      header: 'Status', 
      cell: (row) => (
        <span className={`admin-badge ${row.isActive ? 'admin-badge-success' : 'admin-badge-warning'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      header: 'Actions', 
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="admin-icon-btn" title="Edit Coupon" onClick={() => handleOpenModal(row)}>
            <Edit size={18} />
          </button>
          <button 
            className="admin-icon-btn" 
            title={row.isActive ? "Deactivate" : "Activate"} 
            onClick={() => handleToggleStatus(row.id, row.isActive)}
            style={{ color: row.isActive ? 'var(--admin-danger)' : 'var(--admin-success)' }}
          >
            {row.isActive ? <X size={18} /> : <Check size={18} />}
          </button>
        </div>
      ) 
    },
  ];

  return (
    <div className="coupons-page">
      <div className="page-header">
        <h1>Coupons Management</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Add Coupon
        </button>
      </div>

      {error && <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

      <div className="admin-card">
        <div className="admin-table-container">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading Coupons...</div>
          ) : coupons.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No coupons found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((col, index) => <th key={index}>{col.header}</th>)}
                </tr>
              </thead>
              <tbody>
                {coupons.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => <td key={colIndex}>{col.cell(row)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="admin-card" style={{ width: '500px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '16px' }}>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
            
            {formError && (
              <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
                {formError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Coupon Code</label>
                <input 
                  type="text"
                  className="admin-input" 
                  value={formData.code} 
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
                  required 
                  disabled={!!editingCoupon}
                  placeholder="e.g. SUMMER50"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="admin-label">Discount Type</label>
                  <select 
                    className="admin-input" 
                    value={formData.discountType}
                    onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Discount Value</label>
                  <input 
                    type="number"
                    className="admin-input" 
                    value={formData.discountValue} 
                    onChange={e => setFormData({ ...formData, discountValue: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="admin-label">Minimum Order (₹)</label>
                  <input 
                    type="number"
                    className="admin-input" 
                    value={formData.minimumOrderAmount} 
                    onChange={e => setFormData({ ...formData, minimumOrderAmount: e.target.value })} 
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="admin-label">Max Discount (₹)</label>
                  <input 
                    type="number"
                    className="admin-input" 
                    value={formData.maximumDiscountAmount} 
                    onChange={e => setFormData({ ...formData, maximumDiscountAmount: e.target.value })} 
                    placeholder="Optional"
                    disabled={formData.discountType === 'FIXED'}
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Total Usage Limit</label>
                <input 
                  type="number"
                  className="admin-input" 
                  value={formData.usageLimit} 
                  onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} 
                  placeholder="Optional (e.g., 100 uses total)"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="admin-label">Start Date</label>
                  <input 
                    type="datetime-local"
                    className="admin-input" 
                    value={formData.startsAt} 
                    onChange={e => setFormData({ ...formData, startsAt: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="admin-label">Expiry Date</label>
                  <input 
                    type="datetime-local"
                    className="admin-input" 
                    value={formData.expiresAt} 
                    onChange={e => setFormData({ ...formData, expiresAt: e.target.value })} 
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
