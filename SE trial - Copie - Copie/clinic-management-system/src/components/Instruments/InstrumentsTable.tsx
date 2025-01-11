import React, { useState } from 'react';
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
    const [currentPage, setCurrentPage] = useState(1);
    const InstrumentssPerPage = 5; // Number of rows to show per page

    const totalPages = Math.ceil(instrument.length / InstrumentssPerPage);
    const paginatedInstruments = instrument.slice(
        (currentPage - 1) * InstrumentssPerPage,
        currentPage * InstrumentssPerPage
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
        <div className="Instruments-table">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Model Number</th>
                        <th>Quantity</th>
                        <th>Min Stock Level</th>
                        <th>Date Acquired</th>
                        <th>Supplier Name</th>
                        <th>Supplier Contact</th>
                        {!isDepUser && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginatedInstruments.map(Instruments => (
                        <tr key={Instruments.name}>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.name}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.category}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.modelNumber}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>
                                <div className="quantity-controls">
                                    <button
                                        className="quantity-btn decrease"
                                        onClick={() => onStockChange(Instruments.name, 'consumption')}
                                        title="Consume stock"
                                    >
                                        -
                                    </button>
                                    <span>{Instruments.quantity}</span>
                                    {!isDepUser && (
                                        <button
                                            className="quantity-btn increase"
                                            onClick={() => onStockChange(Instruments.name, 'addition')}
                                            title="Add stock"
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.minStock}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{new Date(Instruments.dateAcquired).toLocaleDateString()}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.supplierName}</td>
                            <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>{Instruments.supplierContact}</td>
                            {!isDepUser && (
                                <td className={`quantity-cell ${Instruments.quantity < Instruments.minStock ? 'low-stock' : ''}`}>
                                    <button
                                        className="edit-btn"
                                        onClick={() => onEdit(Instruments.name)}
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
