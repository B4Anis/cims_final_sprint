import React from 'react';
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
                        <th>Expriration Date</th>
                        <th>Supplier Name</th>
                        <th>Supplier contact</th>
                        {!isDepUser && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {consumable.map(Consumables => (
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
        </div>
    );
};
