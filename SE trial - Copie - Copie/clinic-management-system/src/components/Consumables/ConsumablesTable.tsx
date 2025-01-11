import React, { useState } from 'react';
import { Consumable } from '../../types/consumable.types';
import './Consumables.css';

interface ConsumablesTableProps {
  consumable: Consumable[];
  onStockChange: (consumablesId: string, changeType: 'addition' | 'consumption') => void;
  onEdit: (consumablesName: string) => void;
  isDepUser: boolean;
}

export const ConsumablesTable: React.FC<ConsumablesTableProps> = ({
  consumable,
  onStockChange,
  onEdit,
  isDepUser,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of rows to display per page

  const totalPages = Math.ceil(consumable.length / itemsPerPage);
  const paginatedConsumables = consumable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="consumables-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Min Stock Level</th>
            <th>Expiration Date</th>
            <th>Supplier Name</th>
            <th>Supplier Contact</th>
            {!isDepUser && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedConsumables.map((item) => (
            <tr key={item._id || item.name}>
              <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}> {item.name}</td>
              <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>{item.category}</td>
              <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>{item.brand}</td>
              <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn decrease"
                    onClick={() => onStockChange(item.name, 'consumption')}
                    title="Consume stock"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  {!isDepUser && (
                    <button
                      className="quantity-btn increase"
                      onClick={() => onStockChange(item.name, 'addition')}
                      title="Add stock"
                    >
                      +
                    </button>
                  )}
                </div>
              </td>
              <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}> {item.minStock}</td>
              <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>{new Date(item.expiryDate).toLocaleDateString()}</td>
              <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>
                {item.supplierName}
              </td>
              <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>
                {item.supplierContact}
              </td>
              {!isDepUser && (
                <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(item.name)}
                    title="Edit item"
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};
