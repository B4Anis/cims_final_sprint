import React, { useState } from 'react';
import { Inox } from '../../types/Inox.types';
import './Inoxs.css';

interface InoxsTableProps {
    inoxItems: Inox[];
    onStockChange: (inoxId: string, changeType: 'addition' | 'consumption') => void;
    onEdit: (inoxId: string) => void;
    isDepUser: boolean;
}

export const InoxsTable: React.FC<InoxsTableProps> = ({ 
    inoxItems, 
    onStockChange, 
    onEdit,
    isDepUser
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const totalPages = Math.ceil(inoxItems.length / itemsPerPage);
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const currentItems = inoxItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="inox-table">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Quantity</th>
                        <th>Min Stock Level</th>
                        <th>Supplier Name</th>
                        <th>Supplier contact</th>
                        {!isDepUser && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(inox => (
                        <tr key={inox.name}>
                            <td className={`quantity-cell ${inox.quantity < inox.minStock ? 'low-stock' : ''}`}>{inox.name}</td>
                            <td className={`quantity-cell ${inox.quantity < inox.minStock ? 'low-stock' : ''}`}>{inox.category}</td>
                            <td className={`quantity-cell ${inox.quantity < inox.minStock ? 'low-stock' : ''}`}>{inox.brand}</td>
                            <td className={`quantity-cell ${inox.quantity < inox.minStock ? 'low-stock' : ''}`}>
                                <div className="quantity-controls">
                                    <button
                                        className="quantity-btn decrease"
                                        onClick={() => onStockChange(inox.name, 'consumption')}
                                    >
                                        -
                                    </button>
                                    <span>{inox.quantity}</span>
                                    {!isDepUser && (
                                        <button
                                            className="quantity-btn increase"
                                            onClick={() => onStockChange(inox.name, 'addition')}
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className={`quantity-cell ${inox.quantity < inox.minStock ? 'low-stock' : ''}`}>{inox.minStock}</td>
                            <td className={`quantity-cell ${inox.quantity < inox.minStock ? 'low-stock' : ''}`}>{inox.supplierName}</td>
                            <td className={`quantity-cell ${inox.quantity < inox.minStock ? 'low-stock' : ''}`}>{inox.supplierContact}</td>
                            {!isDepUser && (
                                <td className={`quantity-cell ${inox.quantity < inox.minStock ? 'low-stock' : ''}`}>
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => onEdit(inox.name)}
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
