import React from 'react';
import { Instrument } from '../../types/Instrument.types';
import './Instruments.css';

interface InstrumentsTableProps {
    instrument: Instrument[];
    onStockChange: (InstrumentsId: string, changeType: 'addition' | 'consumption') => void;
    onEdit: (InstrumentsId: string) => void;
    isDepUser: boolean;
}

export const InstrumentsTable: React.FC<InstrumentsTableProps> = ({ 
    instrument, 
    onStockChange, 
    onEdit,
    isDepUser 
}) => {
    return (
        <div className="Instruments-table">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>modelNumber</th>
                        <th>Quantity</th>
                        <th>Min Stock Level</th>
                        <th>Date Acquired</th>
                        <th>Supplier Name</th>
                        <th>Supplier contact</th>
                        {!isDepUser && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {instrument.map(Instruments => (
                        <tr key={Instruments.name}>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.name}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.category}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.modelNumber}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>
                                <div className="quantity-controls">
                                    <button
                                        className="quantity-btn decrease"
                                        onClick={() => onStockChange(Instruments.name, 'consumption')}
                                    >
                                        -
                                    </button>
                                    <span>{Instruments.quantity}</span>
                                    {!isDepUser && (
                                        <button
                                            className="quantity-btn increase"
                                            onClick={() => onStockChange(Instruments.name, 'addition')}
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.minStock}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.dateAcquired ? new Date(Instruments.dateAcquired).toLocaleDateString() : 'N/A'}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.supplierName}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.supplierContact}</td>
                            {!isDepUser && (
                                <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => onEdit(Instruments.name)}
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
