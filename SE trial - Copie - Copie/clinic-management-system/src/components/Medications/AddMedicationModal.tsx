import React, { useState } from 'react';
import { Medication, MedicationFamily } from '../../types/medication.types';
import './Medications.css';

interface AddMedicationModalProps {
    family: MedicationFamily;
    onClose: () => void;
    onSubmit: (medication: Omit<Medication, 'id'>) => void;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
    family,
    onClose,
    onSubmit
}) => {
    const [formData, setFormData] = useState({
        genericName: '',
        marketName: '',
        dosage: '',
        dosageForm: '',
        expiryDate: '',
        packSize: 0,
        quantity: 0,
        minQuantity: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            family,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'minQuantity' || name === 'packSize' ? parseFloat(value) : value
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Medication</h2>
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
                        <label>Initial Quantity:</label>
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
                            Add Medication
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
