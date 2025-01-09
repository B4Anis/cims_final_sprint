import React, { useState } from 'react';
import { NonConsumable } from '../../types/NonConsumable.types';
import './NonConsumables.css';

interface NonConsumablesTableProps {
    nonConsumable: NonConsumable[];
    onStockChange: (nonConsumableId: string, changeType: 'addition' | 'consumption') => void;
    onEdit: (nonConsumableName: string) => void;
    isDepUser: boolean;
}

export const NonConsumablesTable: React.FC<NonConsumablesTableProps> = ({ 
    nonConsumable, 
    onStockChange, 
    onEdit,
    isDepUser
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;

    const totalPages = Math.ceil(nonConsumable.length / rowsPerPage);

    // Determine the rows for the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = nonConsumable.slice(startIndex, startIndex + rowsPerPage);

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
        <div className="non-consumables-table">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Quantity</th>
                        <th>Min Stock Level</th>
                        <th>Supplier Name</th>
                        <th>Supplier Contact</th>
                        {!isDepUser && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map(item => (
                        <tr key={item._id || item.name}>
                            <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>{item.name}</td>
                            <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>{item.category}</td>
                            <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>{item.brand}</td>
                            <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>
                                <div className="quantity-controls">
                                    <button
                                        className="quantity-btn decrease"
                                        onClick={() => onStockChange(item._id || item.name, 'consumption')}
                                        title="Consume stock"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    {!isDepUser && (
                                        <button
                                            className="quantity-btn increase"
                                            onClick={() => onStockChange(item._id || item.name, 'addition')}
                                            title="Add stock"
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>{item.minStock}</td>
                            <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>{item.supplierName}</td>
                            <td className={`quantity-cell ${item.quantity < item.minStock ? 'low-stock' : ''}`}>{item.supplierContact}</td>
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

            {/* Pagination Controls */}
            <div className="pagination">
                <button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1}
                    className="pagination-btn"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
