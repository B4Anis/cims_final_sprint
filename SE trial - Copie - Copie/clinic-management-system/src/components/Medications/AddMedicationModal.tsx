import React, { useEffect, useState } from 'react';
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
    interface FormData {
        genericName: string;
        marketName: string;
        dosage: string;
        dosageForm: string;
        expiryDate: string;
        packSize: number;
        quantityInStock: number;
        minStockLevel: number;
        quantity: number;
        minQuantity: number;
    }

    const [formData, setFormData] = useState<FormData>({
        genericName: '',
        marketName: '',
        dosage: '',
        dosageForm: '',
        expiryDate: '',
        packSize: 0,
        quantityInStock: 0,
        minStockLevel: 0,
        quantity: 0,
        minQuantity: 0
    });

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            quantity: prev.quantityInStock,
            minQuantity: prev.minStockLevel
        }));
    }, []);
   

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
            [name]: name === 'quantityInStock' || name === 'minStockLevel' || name === 'packSize' ? parseFloat(value) : value
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
                        <label>Initial quantityInStock:</label>
                        <input
                            type="number"
                            name="quantityInStock"
                            value={formData.quantityInStock}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Minimum quantityInStock:</label>
                        <input
                            type="number"
                            name="minStockLevel"
                            value={formData.minStockLevel}
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
