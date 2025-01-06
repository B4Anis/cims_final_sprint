import React from 'react';
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
                    {nonConsumable.map(item => (
                        <tr key={item._id || item.name}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.brand}</td>
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
                            <td>{item.minStock}</td>
                            <td>{item.supplierName}</td>
                            <td>{item.supplierContact}</td>
                            {!isDepUser && (
                                <td>
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
        </div>
    );
};
