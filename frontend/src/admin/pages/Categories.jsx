import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { categoryService } from '../services/category.service';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true
  });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getCategories();
      // Ensure we extract array if paginated
      setCategories(Array.isArray(data) ? data : data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        isActive: category.isActive !== false
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', imageUrl: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        setSuccessMsg('Category updated successfully');
      } else {
        await categoryService.createCategory(formData);
        setSuccessMsg('Category created successfully');
      }
      handleCloseModal();
      fetchCategories();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await categoryService.updateCategoryStatus(id, !currentStatus);
      setSuccessMsg(`Category ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchCategories();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryService.deleteCategory(id);
      setSuccessMsg('Category deleted successfully');
      fetchCategories();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    try {
      setIsUploading(true);
      const res = await categoryService.uploadCategoryImage(file);
      setFormData(prev => ({ ...prev, imageUrl: res.imageUrl }));
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageUpload(e);
  };

  const columns = [
    { 
      header: 'Category', 
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={row.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: 'var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: '10px' }}>No Img</span>
            </div>
          )}
          <div>
            <div className="font-medium">{row.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>/{row.slug}</div>
          </div>
        </div>
      ) 
    },
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
          <button className="admin-icon-btn" title="Edit" onClick={() => handleOpenModal(row)}>
            <Edit size={18} />
          </button>
          <button 
            className="admin-icon-btn" 
            title="Delete Category"
            style={{ color: 'var(--admin-danger)' }}
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ) 
    },
  ];

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Categories</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Category
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
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading Categories...</div>
          ) : categories.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No categories found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((col, index) => <th key={index}>{col.header}</th>)}
                </tr>
              </thead>
              <tbody>
                {categories.map((row, rowIndex) => (
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
          <div className="admin-card" style={{ width: '400px', padding: '24px' }}>
            <h2 style={{ marginBottom: '20px' }}>{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Name</label>
                <input 
                  className="admin-input" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} 
                  required 
                />
              </div>
              <div>
                <label className="admin-label">Slug</label>
                <input 
                  className="admin-input" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea 
                  className="admin-input" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              <div>
                <label className="admin-label">Category Image</label>
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{
                    border: '2px dashed var(--admin-border)',
                    borderRadius: '4px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#fafafa',
                    position: 'relative'
                  }}
                >
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                  {isUploading ? (
                    <div style={{ color: 'var(--admin-primary)' }}>Uploading...</div>
                  ) : formData.imageUrl ? (
                    <div>
                      <img src={formData.imageUrl} alt="Category" style={{ maxHeight: '100px', borderRadius: '4px', marginBottom: '10px' }} />
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Click or drag to replace image</div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--admin-text-muted)' }}>
                      Drag and drop an image here, or click to select
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={handleCloseModal} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={isUploading} style={{ flex: 1 }}>{isUploading ? 'Uploading...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
