import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProducts();
      // Handle pagination object if exists
      setProducts(Array.isArray(data) ? data : data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await productService.updateProductStatus(id, !currentStatus);
      setSuccessMsg(`Product ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchProducts();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const columns = [
    { 
      header: 'Product', 
      cell: (row) => {
        // Find main image if variants or images array exist
        const mainImage = row.images?.[0]?.url || row.imageUrl;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {mainImage ? (
              <img src={mainImage} alt={row.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: 'var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px' }}>No Img</span>
              </div>
            )}
            <div>
              <div className="font-medium">{row.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{row.variants?.[0]?.sku || row.sku || 'No SKU'}</div>
            </div>
          </div>
        );
      } 
    },
    { header: 'Category', cell: (row) => row.category?.name || 'Uncategorized' },
    { header: 'Price', cell: (row) => formatCurrency(row.basePrice || row.price || 0) },
    { header: 'Stock', cell: (row) => row.variants?.reduce((sum, v) => sum + (v.stockOnHand || 0), 0) || row.stockOnHand || 0 },
    { 
      header: 'Status', 
      cell: (row) => (
        <span className={`admin-badge ${row.isActive ? 'admin-badge-success' : 'admin-badge-danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      header: 'Actions', 
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="admin-icon-btn" title="View"><Eye size={18} /></button>
          <button className="admin-icon-btn" title="Edit"><Edit size={18} /></button>
          <button 
            className="admin-icon-btn" 
            title={row.isActive ? "Deactivate" : "Activate"} 
            style={{ color: row.isActive ? 'var(--admin-danger)' : 'var(--admin-success)' }}
            onClick={() => toggleStatus(row.id, row.isActive)}
          >
            {row.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
          </button>
        </div>
      ) 
    },
  ];

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <button 
          className="admin-btn admin-btn-primary"
          onClick={() => navigate('/admin/products/create')}
        >
          <Plus size={18} /> Add New Product
        </button>
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
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading Products...</div>
          ) : products.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No products found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex}>{col.cell(row)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
