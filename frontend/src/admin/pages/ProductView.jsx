import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Package, Tag, IndianRupee, Image as ImageIcon } from 'lucide-react';
import { productService } from '../services/product.service';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProduct(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  if (isLoading) {
    return <div className="page-header"><div style={{ padding: '40px', textAlign: 'center' }}>Loading Product...</div></div>;
  }

  if (error || !product) {
    return (
      <div className="page-header">
        <div style={{ padding: '40px', textAlign: 'center', color: '#e53e3e' }}>
          {error || 'Product not found'}
          <br /><br />
          <button className="admin-btn admin-btn-outline" onClick={() => navigate('/admin/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-view-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="admin-icon-btn" onClick={() => navigate('/admin/products')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Product Details</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
          <Edit size={18} /> Edit Product
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Left Column: Details */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="admin-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', color: 'var(--admin-text)', marginBottom: '8px' }}>{product.name}</h2>
              <span className={`admin-badge ${product.isActive ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p style={{ color: 'var(--admin-text-muted)', marginBottom: '16px' }}>{product.description || 'No description provided.'}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', color: 'var(--admin-primary)' }}><Tag size={20} /></div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>SKU</div>
                  <div className="font-medium">{product.sku || 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', color: 'var(--admin-primary)' }}><IndianRupee size={20} /></div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Base Price</div>
                  <div className="font-medium">{formatCurrency(product.basePrice || product.price || 0)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', color: 'var(--admin-primary)' }}><Package size={20} /></div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Stock</div>
                  <div className="font-medium">{product.stockOnHand || 0} units</div>
                </div>
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="admin-card">
            <div className="section-header" style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)' }}>
              <h3 style={{ margin: 0 }}>Product Variants</h3>
            </div>
            <div className="admin-table-container">
              {!product.variants || product.variants.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No variants found for this product.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Size</th>
                      <th>Color</th>
                      <th>Stock</th>
                      <th>Add. Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((v, i) => (
                      <tr key={i}>
                        <td className="font-medium">{v.sku || '-'}</td>
                        <td>{v.size || '-'}</td>
                        <td>
                          {v.color ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: v.color, display: 'inline-block', border: '1px solid #ccc' }}></span>
                              {v.color}
                            </div>
                          ) : '-'}
                        </td>
                        <td>{v.stockOnHand || 0}</td>
                        <td>{v.additionalPrice ? `+${formatCurrency(v.additionalPrice)}` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Images & Meta */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Images */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} /> Images
            </h3>
            {!product.images || product.images.length === 0 ? (
               <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', color: 'var(--admin-text-muted)' }}>
                 No images available
               </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {product.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', paddingBottom: '100%', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <img 
                      src={img.url} 
                      alt={`Product ${idx}`} 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meta Information */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Organization</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'block' }}>Category</span>
                <span className="font-medium">{product.category?.name || 'Uncategorized'}</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'block' }}>Slug</span>
                <span className="font-medium" style={{ fontFamily: 'monospace' }}>{product.slug}</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'block' }}>Created At</span>
                <span className="font-medium">{new Date(product.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductView;
