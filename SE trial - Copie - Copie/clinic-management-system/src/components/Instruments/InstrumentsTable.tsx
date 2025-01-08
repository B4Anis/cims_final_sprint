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
                            <td>{Instruments.name}</td>
                            <td>{Instruments.category}</td>
                            <td>{Instruments.modelNumber}</td>
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
                            <td>{Instruments.minStock}</td>
                            <td>{Instruments.dateAcquired ? new Date(Instruments.dateAcquired).toLocaleDateString() : 'N/A'}</td>
                            <td>{Instruments.supplierName}</td>
                            <td>{Instruments.supplierContact}</td>
                            {!isDepUser && (
                                <td>
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
