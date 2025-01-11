import React from 'react';
import { Medication } from '../../types/medication.types';
import './Medications.css';
import { FaRegTrashAlt } from "react-icons/fa";
interface MedicationTableProps {
    medications: Medication[];
    onStockChange: (medicationId: string, changeType: 'addition' | 'consumption') => void;
    onEdit: (medicationId: string) => void;
    onDelete: (medicationId: string) => void;
}

export const MedicationTable: React.FC<MedicationTableProps> = ({ 
    medications, 
    onStockChange, 
    onEdit ,
    onDelete
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
                        <th>Actions</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {medications.map(medication => {
                
                        return (

                            <tr key={medication.id}>
                            {/* <td>{medication.id}</td> */}
                            <td>{medication.genericName}</td>
                            <td>{medication.marketName}</td>
                            <td>{medication.dosage}</td>
                            <td>{medication.dosageForm}</td>
                            <td>{medication.packSize}</td>
                            <td>{new Date(medication.expiryDate).toLocaleDateString()}</td>
                            <td className={`quantity-cell ${medication.quantity < medication.minQuantity ? 'low-stock' : ''}`}>
                                <div className="quantity-controls">
                                    <button
                                        className="quantity-btn decrease"
                                        onClick={() => onStockChange(medication.id, 'consumption')}
                                        >
                                        -
                                    </button>
                                    <span>{medication.quantity}</span>
                                    <button
                                        className="quantity-btn increase"
                                        onClick={() => onStockChange(medication.id, 'addition')}
                                        >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td>{medication.minQuantity}</td>
                            <td className="">

                                <div className="actions">

                                <button
                                    className="action-btn edit-btn"
                                    onClick={() => onEdit(medication.id)}
                                    >
                                    Edit
                                </button>

                                
                                <FaRegTrashAlt size={20} color="red" 
                                    onClick={() => onDelete(medication.id)}
                                    
                                    />
                                    </div>

                                
                            </td>
                        </tr>
                                )
                            }
                    )}
                </tbody>
            </table>
        </div>

    );
};
