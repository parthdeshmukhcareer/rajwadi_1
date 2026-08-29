import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { inventoryService } from '../services/inventory.service';

const Inventory = () => {
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [modalError, setModalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const data = await inventoryService.getInventory();
      const products = Array.isArray(data) ? data : data.data || [];
      
      // Flatten products into variants for inventory management
      const flattened = [];
      products.forEach(product => {
        const productMainImage = product.images?.[0]?.url || product.imageUrl;
        if (product.variants && product.variants.length > 0) {
          product.variants.forEach((variant, index) => {
            flattened.push({
              ...variant,
              productName: product.name,
              productImage: productMainImage,
              variantLabel: `Variant ${index + 1}`
            });
          });
        }
      });
      
      setVariants(flattened);
      setError(null);
    } catch (err) {
      setError('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenModal = (variant) => {
    setEditingVariant(variant);
    setNewStock(variant.stockOnHand.toString());
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVariant(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError(null);
    
    const stockVal = parseInt(newStock, 10);
    
    if (isNaN(stockVal)) {
      setModalError('Please enter a valid number');
      return;
    }
    
    if (stockVal < 0) {
      setModalError('Stock cannot be negative');
      return;
    }
    
    if (stockVal < editingVariant.reservedStock) {
      setModalError(`Stock cannot be reduced below reserved stock (${editingVariant.reservedStock})`);
      return;
    }

    setIsSubmitting(true);
    try {
      await inventoryService.updateStock(editingVariant.id, stockVal);
      setSuccessMsg(`Stock updated successfully for ${editingVariant.sku}`);
      handleCloseModal();
      fetchInventory();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setModalError(err.message || 'Failed to update stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { 
      header: 'Product', 
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {row.productImage ? (
            <img src={row.productImage} alt={row.productName} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: 'var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: '10px' }}>No Img</span>
            </div>
          )}
          <div>
            <div className="font-medium">{row.productName}</div>
          </div>
        </div>
      ) 
    },
    { header: 'Variant', cell: (row) => row.variantLabel },
    { header: 'SKU', cell: (row) => <span style={{ fontFamily: 'monospace' }}>{row.sku}</span> },
    { header: 'Size', cell: (row) => row.size || '-' },
    { header: 'Color', cell: (row) => row.color || '-' },
    { header: 'Stock On Hand', cell: (row) => <strong>{row.stockOnHand}</strong> },
    { header: 'Reserved Stock', cell: (row) => <span style={{ color: 'var(--admin-warning)' }}>{row.reservedStock}</span> },
    { header: 'Available Stock', cell: (row) => {
      const available = (row.stockOnHand || 0) - (row.reservedStock || 0);
      return <span style={{ color: available > 0 ? 'var(--admin-success)' : 'var(--admin-danger)', fontWeight: 'bold' }}>{available}</span>;
    }},
    { 
      header: 'Status', 
      cell: (row) => {
        const available = (row.stockOnHand || 0) - (row.reservedStock || 0);
        let badgeClass = 'admin-badge-success';
        let label = 'In Stock';
        if (available <= 5 && available > 0) {
          badgeClass = 'admin-badge-warning';
          label = 'Low Stock';
        } else if (available <= 0) {
          badgeClass = 'admin-badge-danger';
          label = 'Out of Stock';
        }
        return <span className={`admin-badge ${badgeClass}`}>{label}</span>;
      }
    },
    { 
      header: 'Actions', 
      cell: (row) => (
        <button className="admin-icon-btn" title="Adjust Stock" onClick={() => handleOpenModal(row)}>
          <Edit size={18} />
        </button>
      ) 
    },
  ];

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Inventory Management</h1>
      </div>

      {successMsg && (
        <div style={{ padding: '12px', backgroundColor: '#c6f6d5', color: '#22543d', borderRadius: '4px', marginBottom: '20px' }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-table-container">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading Inventory...</div>
          ) : variants.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No inventory variants found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((col, index) => <th key={index}>{col.header}</th>)}
                </tr>
              </thead>
              <tbody>
                {variants.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => <td key={colIndex}>{col.cell(row)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && editingVariant && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="admin-card" style={{ width: '400px', padding: '24px' }}>
            <h2 style={{ marginBottom: '8px' }}>Adjust Stock</h2>
            <p style={{ color: 'var(--admin-text-muted)', marginBottom: '20px' }}>
              {editingVariant.productName} ({editingVariant.sku})
            </p>
            
            {modalError && (
              <div style={{ padding: '8px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
                {modalError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--admin-bg-main)', borderRadius: '4px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Reserved Stock</div>
                  <div style={{ fontWeight: 'bold' }}>{editingVariant.reservedStock}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Current Available</div>
                  <div style={{ fontWeight: 'bold' }}>{(editingVariant.stockOnHand || 0) - (editingVariant.reservedStock || 0)}</div>
                </div>
              </div>
              
              <div>
                <label className="admin-label">New Stock On Hand</label>
                <input 
                  type="number"
                  className="admin-input" 
                  value={newStock} 
                  onChange={e => setNewStock(e.target.value)} 
                  required 
                />
                <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                  Total physical units in warehouse
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={handleCloseModal} style={{ flex: 1 }} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Update Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
