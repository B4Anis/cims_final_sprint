import React, { useState } from 'react';
import { Medication } from '../../types/medication.types';
import './Medications.css';

/**
 * MedicationTable Component
 * Displays medications in a paginated table format with stock management controls
 * Supports different user roles with varying levels of access
 */
interface MedicationTableProps {
  medications: Medication[];
  onStockChange: (medicationId: string, changeType: 'addition' | 'consumption') => void;
  onEdit: (medicationId: string) => void;
  isDepUser: boolean;
}

export const MedicationTable: React.FC<MedicationTableProps> = ({
  medications,
  onStockChange,
  onEdit,
  isDepUser,
}) => {
  /**
   * Pagination state and controls
   * Displays 5 items per page with next/previous navigation
   */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of rows per page

  const totalPages = Math.ceil(medications.length / itemsPerPage);
  
  /**
   * Calculates the current page's medications to display
   * Uses array slice for pagination
   */
  const paginatedMedications = medications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /**
   * Pagination control handlers
   * Prevents navigation beyond valid page ranges
   */
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
    <div className="medication-table">
      <table>
        <thead>
          <tr>
            <th>Generic Name</th>
            <th>Market Name</th>
            <th>Dosage</th>
            <th>Dosage Form</th>
            <th>Pack Size</th>
            <th>Expiry Date</th>
            <th>Quantity</th>
            <th>Min Quantity</th>
            {!isDepUser && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedMedications.map((medication) => (
            <tr key={medication.id}>
              <td>{medication.genericName}</td>
              <td>{medication.marketName}</td>
              <td>{medication.dosage}</td>
              <td>{medication.dosageForm}</td>
              <td>{medication.packSize}</td>
              <td>{new Date(medication.expiryDate).toLocaleDateString()}</td>
              <td
                className={`quantity-cell ${
                  medication.quantity < medication.minQuantity ? 'low-stock' : ''
                }`}
              >
                <div className="quantity-controls">
                  {isDepUser ? (
                    <button
                      className="quantity-btn decrease"
                      onClick={() => onStockChange(medication.id, 'consumption')}
                    >
                      -
                    </button>
                  ) : (
                    <React.Fragment>
                      <button
                        className="quantity-btn decrease"
                        onClick={() => onStockChange(medication.id, 'consumption')}
                      >
                        -
                      </button>
                      <button
                        className="quantity-btn increase"
                        onClick={() => onStockChange(medication.id, 'addition')}
                      >
                        +
                      </button>
                    </React.Fragment>
                  )}
                  <span>{medication.quantity}</span>
                </div>
              </td>
              <td>{medication.minQuantity}</td>
              {!isDepUser && (
                <td>
                  <div className="actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(medication.id)}
                    >
                      Edit
                    </button>
                  </div>
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
