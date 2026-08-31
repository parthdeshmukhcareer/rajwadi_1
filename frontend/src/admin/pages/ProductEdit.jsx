import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { productService } from '../services/product.service';
import { categoryService } from '../services/category.service';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    basePrice: '',
    compareAtPrice: '',
    fabric: '',
    workType: '',
    occasion: '',
    gstRate: '18',
    hsnCode: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catData, productData] = await Promise.all([
          categoryService.getCategories(),
          productService.getProduct(id)
        ]);
        
        const cats = Array.isArray(catData) ? catData : catData.data || [];
        setCategories(cats.filter(c => c.isActive !== false));
        
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          categoryId: productData.categoryId || '',
          basePrice: productData.basePrice || '',
          compareAtPrice: productData.compareAtPrice || '',
          fabric: productData.fabric || '',
          workType: productData.workType || '',
          occasion: productData.occasion || '',
          gstRate: productData.gstRate?.toString() || '18',
          hsnCode: productData.hsnCode || '',
          isActive: productData.isActive,
        });
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg('');

    try {
      if (!formData.categoryId) {
        throw new Error('Please select a category');
      }

      const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        categoryId: formData.categoryId,
        basePrice: parseInt(formData.basePrice) || 0,
        compareAtPrice: formData.compareAtPrice ? parseInt(formData.compareAtPrice) : undefined,
        fabric: formData.fabric || undefined,
        workType: formData.workType || undefined,
        occasion: formData.occasion || undefined,
        gstRate: parseInt(formData.gstRate) || 0,
        hsnCode: formData.hsnCode || undefined,
        isActive: formData.isActive
      };

      await productService.updateProduct(id, payload);
      setSuccessMsg('Product updated successfully!');
      setTimeout(() => navigate(`/admin/products/${id}`), 2000);
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="page-header"><div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div></div>;
  }

  return (
    <div className="product-create-page">
      <form onSubmit={handleSubmit}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button type="button" className="admin-icon-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={24} />
            </button>
            <h1>Edit Product</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="admin-btn admin-btn-outline" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
              <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}
        {successMsg && <div style={{ padding: '12px', backgroundColor: '#c6f6d5', color: '#22543d', borderRadius: '4px', marginBottom: '20px' }}>{successMsg}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="admin-card">
              <h2>Basic Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label className="admin-label">Product Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="admin-input" required />
                </div>
                <div>
                  <label className="admin-label">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="admin-input" rows={4}></textarea>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h2>Product Specifications</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label className="admin-label">Fabric</label>
                  <input type="text" name="fabric" value={formData.fabric} onChange={handleChange} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Work Type</label>
                  <input type="text" name="workType" value={formData.workType} onChange={handleChange} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Occasion</label>
                  <input type="text" name="occasion" value={formData.occasion} onChange={handleChange} className="admin-input" />
                </div>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="admin-card">
              <h2>Organization</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label className="admin-label">Category</label>
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="admin-input" required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Status</label>
                  <select name="isActive" value={formData.isActive ? "true" : "false"} onChange={e => setFormData({...formData, isActive: e.target.value === "true"})} className="admin-input">
                    <option value="false">Draft</option>
                    <option value="true">Active</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h2>Pricing</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label className="admin-label">Base Price (₹)</label>
                  <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="admin-input" required />
                </div>
                <div>
                  <label className="admin-label">Compare At Price (₹)</label>
                  <input type="number" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleChange} className="admin-input" />
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h2>Taxation</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label className="admin-label">HSN Code</label>
                  <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">GST Rate (%)</label>
                  <select name="gstRate" value={formData.gstRate} onChange={handleChange} className="admin-input">
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
