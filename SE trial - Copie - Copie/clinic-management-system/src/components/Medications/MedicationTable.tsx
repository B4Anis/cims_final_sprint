import React from 'react';
import { Medication } from '../../types/medication.types';
import './Medications.css';
import { FaRegTrashAlt } from "react-icons/fa";
interface MedicationTableProps {
    medications: Medication[];
    onStockChange: (medicationId: string, changeType: 'addition' | 'consumption') => void;
    onEdit: (medicationId: string) => void;
    onDelete: (medicationId: string) => void;
    isDepUser: boolean;
}

export const MedicationTable: React.FC<MedicationTableProps> = ({ 
    medications, 
    onStockChange, 
    onEdit,
    onDelete,
    isDepUser
}) => {
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
                    {medications.map(medication => (
                        <tr key={medication.id}>
                            <td>{medication.genericName}</td>
                            <td>{medication.marketName}</td>
                            <td>{medication.dosage}</td>
                            <td>{medication.dosageForm}</td>
                            <td>{medication.packSize}</td>
                            <td>{new Date(medication.expiryDate).toLocaleDateString()}</td>
                            <td className={`quantity-cell ${medication.quantity < medication.minQuantity ? 'low-stock' : ''}`}>
                                <div className="quantity-controls">
                                    {isDepUser ? (
                                        <button
                                            className="quantity-btn decrease"
                                            onClick={() => onStockChange(medication.id, 'consumption')}
                                        >
                                            -
                                        </button>
                                    ) : (
                                        <>
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
                                        </>
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
                                        <FaRegTrashAlt 
                                            size={20} 
                                            color="red" 
                                            onClick={() => onDelete(medication.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
