import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewService } from '../services/review.service';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 24;

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await reviewService.getReviews(page, limit, statusFilter);
      setReviews(Array.isArray(data) ? data : data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await reviewService.updateReviewStatus(id, newStatus);
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to update review status');
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="reviews-page">
      <div className="page-header">
        <h1>Reviews Moderation</h1>
        <select 
          className="admin-input" 
          style={{ width: '200px' }} 
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="HIDDEN">Hidden</option>
        </select>
      </div>

      {error && <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

      <div className="admin-card">
        <div className="admin-table-container">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading Reviews...</div>
          ) : reviews.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No reviews found.</div>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        <div style={{ fontWeight: '500' }}>{row.product?.name || 'Unknown Product'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>ID: {row.productId?.substring(0,8)}...</div>
                      </td>
                      <td>
                        <div>{row.user?.firstName} {row.user?.lastName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{row.user?.email}</div>
                      </td>
                      <td style={{ color: '#fbbf24', fontSize: '18px' }}>
                        {renderStars(row.rating)}
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <div style={{ fontWeight: 'bold' }}>{row.title}</div>
                        <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.comment}>
                          {row.comment}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${row.status === 'PUBLISHED' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                      <td>
                        {row.status === 'PUBLISHED' ? (
                          <button className="admin-btn admin-btn-outline" style={{ padding: '4px 12px', fontSize: '12px', color: 'var(--admin-danger)', borderColor: 'var(--admin-danger)' }} onClick={() => handleUpdateStatus(row.id, 'HIDDEN')}>
                            Hide
                          </button>
                        ) : (
                          <button className="admin-btn admin-btn-outline" style={{ padding: '4px 12px', fontSize: '12px', color: 'var(--admin-success)', borderColor: 'var(--admin-success)' }} onClick={() => handleUpdateStatus(row.id, 'PUBLISHED')}>
                            Publish
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid var(--admin-border)' }}>
                <span style={{ fontSize: '14px', color: 'var(--admin-text-muted)' }}>Showing page {page}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="admin-btn admin-btn-outline" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button 
                    className="admin-btn admin-btn-outline" 
                    onClick={() => setPage(p => p + 1)}
                    disabled={reviews.length < limit}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
