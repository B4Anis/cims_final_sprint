import React, { useState } from 'react';
import { Medication } from '../../types/medication.types';
import './Medications.css';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
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
