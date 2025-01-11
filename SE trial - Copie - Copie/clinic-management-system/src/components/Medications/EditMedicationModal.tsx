import React, { useState, useEffect } from 'react';
import { Medication } from '../../types/medication.types';
import './Medications.css';

/**
 * EditMedicationModal Component
 * Modal for editing existing medication details
 * Includes validation and preserves existing values
 */
interface EditMedicationModalProps {
    medication: Medication;
    onClose: () => void;
    onSubmit: (medication: Medication) => void;
}

export const EditMedicationModal: React.FC<EditMedicationModalProps> = ({
    medication,
    onClose,
    onSubmit
}) => {
    const [formData, setFormData] = useState({
        ...medication
    });

    /**
     * Initializes form data with existing medication values
     * Synchronizes quantity fields on component mount
     */
    useEffect(() => {
        setFormData({
            ...medication
        });
    }, [medication]);

    /**
     * Handles form submission for medication updates
     * Validates all fields before submitting
     * @param e - Form submission event
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData); 
    };

    /**
     * Validates form field values
     * @param name - Field name to validate
     * @param value - Field value to validate
     * @returns Error message if validation fails, undefined if passes
     */
    const validateField = (name: string, value: any): string | undefined => {
        switch (name) {
            case 'quantity':
            case 'minQuantity':
                if (value < 0) {
                    return 'Quantity must be a non-negative number';
                }
                break;
            case 'packSize':
                if (value < 1) {
                    return 'Pack size must be a positive integer';
                }
                break;
            default:
                break;
        }
        return undefined;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) {
            console.error(error);
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'minQuantity' ? parseFloat(value) : value
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Medication</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Generic Name:</label>
                        <input
                            type="text"
                            name="genericName"
                            value={formData.genericName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Market Name:</label>
                        <input
                            type="text"
                            name="marketName"
                            value={formData.marketName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Dosage:</label>
                        <input
                            type="text"
                            name="dosage"
                            value={formData.dosage}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Dosage Form:</label>
                        <input
                            type="text"
                            name="dosageForm"
                            value={formData.dosageForm}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry Date:</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Pack Size:</label>
                        <input
                            type="number"
                            name="packSize"
                            value={formData.packSize}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Quantity:</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Minimum Quantity:</label>
                        <input
                            type="number"
                            name="minQuantity"
                            value={formData.minQuantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="submit-btn">
                            Save Changes
                        </button>
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
