import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, Calendar } from 'lucide-react';
import { customerService } from '../services/customer.service';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await customerService.getCustomers();
      // Handle array or paginated response
      setCustomers(Array.isArray(data) ? data : data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    (c.firstName && c.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.lastName && c.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const columns = [
    { 
      header: 'Customer', 
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--admin-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {row.firstName?.[0] || 'C'}
          </div>
          <div>
            <div className="font-medium">{row.firstName} {row.lastName}</div>
          </div>
        </div>
      ) 
    },
    { 
      header: 'Contact Info', 
      cell: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-muted)' }}>
            <Mail size={14} /> <span>{row.email}</span>
          </div>
          {row.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-muted)' }}>
              <Phone size={14} /> <span>{row.phone}</span>
            </div>
          )}
        </div>
      ) 
    },
    { header: 'Gender', cell: (row) => row.gender || '-' },
    { 
      header: 'Joined On', 
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color="var(--admin-text-muted)" />
          <span>{formatDate(row.createdAt)}</span>
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
  ];

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Customers</h1>
        <div className="admin-search-container" style={{ width: '300px', backgroundColor: 'var(--admin-bg-surface)' }}>
          <Search size={18} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={handleSearch}
            className="admin-search-input"
          />
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-table-container">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading Customers...</div>
          ) : customers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No customers found.</div>
          ) : filteredCustomers.length === 0 ? (
             <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No matches found for "{searchQuery}".</div>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((col, index) => <th key={index}>{col.header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((col, colIndex) => <td key={colIndex}>{col.cell(row)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 0', borderTop: '1px solid var(--admin-border)', marginTop: '20px' }}>
                  <div style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} entries
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="admin-btn admin-btn-outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      Previous
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px', color: 'var(--admin-text-main)' }}>
                      Page {currentPage} of {totalPages}
                    </div>
                    <button
                      className="admin-btn admin-btn-outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
