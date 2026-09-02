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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [variants, setVariants] = useState([]);

  const VariantRow = ({ variant, onUpdate, onDelete, basePrice }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...variant });

    const handleSave = () => {
      onUpdate(variant.id, {
        price: parseInt(editData.price) || basePrice || 0,
        compareAtPrice: editData.compareAtPrice ? parseInt(editData.compareAtPrice) : null,
        stockOnHand: parseInt(editData.stockOnHand) || 0,
        isActive: editData.isActive
      });
      setIsEditing(false);
    };

    if (isEditing) {
      return (
        <div style={{ display: 'flex', gap: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px', alignItems: 'center' }}>
          <div style={{ width: '60px', fontWeight: 'bold' }}>{variant.size}</div>
          <input type="number" value={editData.price} onChange={e => setEditData({ ...editData, price: e.target.value })} placeholder="Price" className="admin-input" style={{ width: '100px', padding: '4px' }} />
          <input type="number" value={editData.compareAtPrice || ''} onChange={e => setEditData({ ...editData, compareAtPrice: e.target.value })} placeholder="Compare At" className="admin-input" style={{ width: '100px', padding: '4px' }} />
          <input type="number" value={editData.stockOnHand} onChange={e => setEditData({ ...editData, stockOnHand: e.target.value })} placeholder="Stock" className="admin-input" style={{ width: '80px', padding: '4px' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
            <input type="checkbox" checked={editData.isActive} onChange={e => setEditData({ ...editData, isActive: e.target.checked })} /> Active
          </label>
          <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
            <button type="button" onClick={handleSave} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
            <button type="button" onClick={() => { setEditData({ ...variant }); setIsEditing(false); }} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', gap: '16px', padding: '8px', border: '1px solid #eee', borderRadius: '4px', marginBottom: '8px', alignItems: 'center' }}>
        <div style={{ width: '60px', fontWeight: 'bold', color: '#432227' }}>{variant.size}</div>
        <div style={{ width: '100px' }}>₹{variant.price}</div>
        <div style={{ width: '100px', textDecoration: 'line-through', color: '#999' }}>{variant.compareAtPrice ? `₹${variant.compareAtPrice}` : '-'}</div>
        <div style={{ width: '80px' }}>Stock: {variant.stockOnHand}</div>
        <div style={{ width: '60px', color: variant.isActive ? 'green' : 'red', fontSize: '12px' }}>{variant.isActive ? 'Active' : 'Inactive'}</div>
        <div style={{ width: '100px', fontSize: '12px', color: '#666' }}>{variant.sku}</div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <button type="button" onClick={() => setIsEditing(true)} style={{ background: '#f8f9fa', border: '1px solid #ddd', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
          <button type="button" onClick={() => onDelete(variant.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
    );
  };

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
    stitchedType: 'UNSTITCHED',
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
          stitchedType: productData.stitchedType || 'UNSTITCHED',
          isActive: productData.isActive,
        });

        if (productData.images && productData.images.length > 0) {
          setProductImages(productData.images);
        }
        
        if (productData.variants && productData.variants.length > 0) {
          setVariants(productData.variants);
        }
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
        stitchedType: formData.stitchedType,
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    try {
      setIsUploading(true);
      const res = await productService.uploadProductImage(id, file);
      if (res && res.imageUrl) {
        setProductImages(prev => [...prev, res]);
        setSuccessMsg('Image uploaded successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    handleImageUpload(e);
  };

  const handleAddDefaultSizes = async () => {
    const existingSizes = variants.map(v => v.size);
    const defaultSizes = ['S', 'M', 'L', 'XL'];
    const missingSizes = defaultSizes.filter(s => !existingSizes.includes(s));
    
    if (missingSizes.length === 0) {
      alert('All default sizes (S, M, L, XL) are already added.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const newVariants = [];
      const baseSku = formData.name.substring(0, 3).toUpperCase() || 'PRD';
      
      for (const size of missingSizes) {
        const payload = {
          sku: `${baseSku}-${size}`,
          size,
          price: parseInt(formData.basePrice) || 0,
          compareAtPrice: formData.compareAtPrice ? parseInt(formData.compareAtPrice) : null,
          stockOnHand: 0,
          isActive: formData.isActive
        };
        const saved = await productService.createVariant(id, payload);
        newVariants.push(saved.data || saved);
      }
      
      setVariants([...variants, ...newVariants]);
      setSuccessMsg(`Added sizes: ${missingSizes.join(', ')}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to add default sizes: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('Are you sure you want to delete this variant?')) return;
    try {
      setIsSubmitting(true);
      const res = await productService.deleteVariant(variantId);
      if (res.data && res.data.deactivated) {
        alert('Variant deactivated because it is linked to past orders.');
        setVariants(variants.map(v => v.id === variantId ? { ...v, isActive: false } : v));
      } else {
        setVariants(variants.filter(v => v.id !== variantId));
        setSuccessMsg('Variant deleted successfully');
        setTimeout(() => setSuccessMsg(''), 2000);
      }
    } catch (err) {
      alert('Failed to delete variant: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateVariant = async (variantId, updatedData) => {
    try {
      setIsSubmitting(true);
      const saved = await productService.updateVariant(variantId, updatedData);
      setVariants(variants.map(v => v.id === variantId ? (saved.data || saved) : v));
      setSuccessMsg('Variant updated successfully');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      alert('Failed to update variant: ' + err.message);
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

            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h2>Product Sizes / Variants</h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button type="button" onClick={handleAddDefaultSizes} className="admin-btn admin-btn-outline" style={{ fontSize: '12px', padding: '4px 8px' }}>
                    Add Default Sizes (S, M, L, XL)
                  </button>
                  {(() => {
                    const existingSizes = variants.map(v => v.size);
                    const allowedSizes = ['S', 'M', 'L', 'XL'];
                    const availableSizes = allowedSizes.filter(s => !existingSizes.includes(s));
                    
                    if (availableSizes.length === 0) {
                      return <span style={{ fontSize: '12px', color: '#6b7280' }}>All sizes added.</span>;
                    }
                    
                    return (
                      <select 
                        style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #d2d6dc', outline: 'none' }}
                        onChange={async (e) => {
                          const size = e.target.value;
                          if (!size) return;
                          
                          try {
                            setIsSubmitting(true);
                            const baseSku = formData.name.substring(0, 3).toUpperCase() || 'PRD';
                            const payload = {
                              sku: `${baseSku}-${size}`,
                              size,
                              price: parseInt(formData.basePrice) || 0,
                              compareAtPrice: formData.compareAtPrice ? parseInt(formData.compareAtPrice) : null,
                              stockOnHand: 0,
                              isActive: formData.isActive
                            };
                            const saved = await productService.createVariant(id, payload);
                            setVariants([...variants, saved.data || saved]);
                            setSuccessMsg(`Added size: ${size}`);
                            setTimeout(() => setSuccessMsg(''), 3000);
                          } catch (err) {
                            alert('Failed to add size: ' + err.message);
                          } finally {
                            setIsSubmitting(false);
                            e.target.value = "";
                          }
                        }}
                      >
                        <option value="">+ Add Size</option>
                        {availableSizes.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    );
                  })()}
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                {variants.length > 0 ? (
                  variants.map(v => (
                    <VariantRow 
                      key={v.id} 
                      variant={v} 
                      onUpdate={handleUpdateVariant} 
                      onDelete={handleDeleteVariant} 
                      basePrice={formData.basePrice} 
                    />
                  ))
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280', border: '1px dashed #d2d6dc', borderRadius: '4px' }}>
                    No variants added. Click "Add Default Sizes" to populate.
                  </div>
                )}
              </div>
            </div>

            <div className="admin-card">
              <h2>Product Image</h2>
              <div style={{ marginTop: '16px' }}>
                <div 
                  style={{
                    border: '2px dashed #d2d6dc',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#f9fafb',
                    position: 'relative'
                  }}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    disabled={isUploading}
                  />
                  
                  {isUploading ? (
                    <div style={{ color: '#6b7280' }}>Uploading image...</div>
                  ) : productImages.length > 0 ? (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {productImages.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <img 
                            src={img.imageUrl.startsWith('http') ? img.imageUrl : `/${img.imageUrl}`}
                            alt="Product" 
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} 
                          />
                          {idx === 0 && <div style={{ position: 'absolute', bottom: -20, left: 0, width: '100%', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>Main Image</div>}
                        </div>
                      ))}
                      <div style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #d2d6dc', borderRadius: '4px', color: '#6b7280' }}>
                        <div style={{ fontSize: '24px', marginBottom: '4px' }}>+</div>
                        <div style={{ fontSize: '12px' }}>Add More</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
                      <p style={{ margin: 0, fontWeight: 500 }}>Click or drag image to upload</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>JPEG, PNG, WEBP up to 8MB</p>
                    </div>
                  )}
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
                <div>
                  <label className="admin-label">Stitched Type</label>
                  <select name="stitchedType" value={formData.stitchedType} onChange={handleChange} className="admin-input">
                    <option value="UNSTITCHED">Unstitched</option>
                    <option value="STITCHED">Stitched</option>
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
