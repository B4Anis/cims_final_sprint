import React, { useState } from 'react';
import { Consumable } from '../../types/consumable.types';
import './Consumables.css';

interface ConsumablesTableProps {
    consumable: Consumable[];
    onStockChange: (ConsumablesId: string, changeType: 'addition' | 'consumption') => void;
    onEdit: (ConsumablesId: string) => void;
    isDepUser: boolean;
}

export const ConsumablesTable: React.FC<ConsumablesTableProps> = ({ 
    consumable, 
    onStockChange, 
    onEdit,
    isDepUser
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
        <div className="Consumables-table">
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
                    {paginatedConsumables.map(Consumables => (
                        <tr key={Consumables.name}>
                            <td className={`quantity-cell ${Consumables.quantity < Consumables.minStock ? 'low-stock' : ''}`}>{Consumables.name}</td>
                            <td className={`quantity-cell ${Consumables.quantity < Consumables.minStock ? 'low-stock' : ''}`}>{Consumables.category}</td>
                            <td className={`quantity-cell ${Consumables.quantity < Consumables.minStock ? 'low-stock' : ''}`}>{Consumables.brand}</td>
                            <td className={`quantity-cell ${Consumables.quantity < Consumables.minStock ? 'low-stock' : ''}`}>
                                <div className="quantity-controls">
                                    <button
                                        className="quantity-btn decrease"
                                        onClick={() => onStockChange(Consumables.name, 'consumption')}
                                    >
                                        -
                                    </button>
                                    <span>{Consumables.quantity}</span>
                                    {!isDepUser && (
                                        <button
                                            className="quantity-btn increase"
                                            onClick={() => onStockChange(Consumables.name, 'addition')}
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className={`quantity-cell ${Consumables.quantity < Consumables.minStock ? 'low-stock' : ''}`}>{Consumables.minStock}</td>
                            <td className={`quantity-cell ${Consumables.quantity < Consumables.minStock ? 'low-stock' : ''}`}>{new Date(Consumables.expiryDate).toLocaleDateString()}</td>
                            <td className={`quantity-cell ${Consumables.quantity < Consumables.minStock ? 'low-stock' : ''}`}>{Consumables.supplierName}</td>
                            <td className={`quantity-cell ${Consumables.quantity < Consumables.minStock ? 'low-stock' : ''}`}>{Consumables.supplierContact}</td>
                            {!isDepUser && (
                                <td className={`quantity-cell ${Consumables.quantity < Consumables.minStock ? 'low-stock' : ''}`}>
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => onEdit(Consumables.name)}
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
