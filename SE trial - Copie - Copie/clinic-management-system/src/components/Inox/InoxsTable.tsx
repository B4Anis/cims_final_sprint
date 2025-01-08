import React from 'react';
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
                    {inoxItems.map(inox => (
                        <tr key={inox.name}>
                            <td>{inox.name}</td>
                            <td>{inox.category}</td>
                            <td>{inox.brand}</td>
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
                            <td>{inox.minStock}</td>
                            <td>{inox.supplierName}</td>
                            <td>{inox.supplierContact}</td>
                            {!isDepUser && (
                                <td>
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
        </div>
    );
};
