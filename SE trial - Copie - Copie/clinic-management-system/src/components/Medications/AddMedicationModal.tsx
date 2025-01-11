import React, { useEffect, useState } from 'react';
import { Medication, MedicationFamily } from '../../types/medication.types';
import { toast } from 'react-toastify';
import './Medications.css';

interface AddMedicationModalProps {
    family: MedicationFamily;
    onClose: () => void;
    onSubmit: (medication: Omit<Medication, 'id'>) => void;
}

interface FormErrors {
    genericName?: string;
    marketName?: string;
    dosage?: string;
    dosageForm?: string;
    expiryDate?: string;
    packSize?: string;
    quantityInStock?: string;
    minStockLevel?: string;
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

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            quantity: prev.quantityInStock,
            minQuantity: prev.minStockLevel
        }));
    }, []);

    const validateField = (name: string, value: any): string | undefined => {
        switch (name) {
            case 'genericName':
                if (!value || value.trim() === '') {
                    return 'Generic name is required';
                }
                if (value.trim().length < 2) {
                    return 'Generic name must be at least 2 characters';
                }
                break;

            case 'marketName':
                if (!value || value.trim() === '') {
                    return 'Market name is required';
                }
                if (value.trim().length < 2) {
                    return 'Market name must be at least 2 characters';
                }
                break;

            case 'dosage':
                if (!value || value === '') {
                    return 'Dosage is required';
                }
                const dosageNum = parseFloat(value);
                if (isNaN(dosageNum)) {
                    return 'Dosage must be a valid number';
                }
                if (dosageNum <= 0) {
                    return 'Dosage must be greater than 0';
                }
                break;

            case 'dosageForm':
                if (!value || value.trim() === '') {
                    return 'Dosage form is required';
                }
                if (value.trim().length < 2) {
                    return 'Dosage form must be at least 2 characters';
                }
                if (/\d/.test(value)) {
                    return 'Dosage form cannot contain numbers';
                }
                break;

            case 'expiryDate':
                if (!value) {
                    return 'Expiry date is required';
                }
                const expiryDate = new Date(value);
                const currentDate = new Date();
                if (expiryDate <= currentDate) {
                    return 'Expiry date must be in the future';
                }
                break;

            case 'packSize':
                const packSizeNum = parseInt(value);
                if (!value || isNaN(packSizeNum)) {
                    return 'Pack size is required and must be a number';
                }
                if (packSizeNum <= 0) {
                    return 'Pack size must be greater than 0';
                }
                if (!Number.isInteger(packSizeNum)) {
                    return 'Pack size must be a whole number';
                }
                break;

            case 'quantityInStock':
                const quantityNum = parseInt(value);
                if (!value || isNaN(quantityNum)) {
                    return 'Initial quantity is required and must be a number';
                }
                if (quantityNum < 0) {
                    return 'Initial quantity cannot be negative';
                }
                if (!Number.isInteger(quantityNum)) {
                    return 'Initial quantity must be a whole number';
                }
                break;

            case 'minStockLevel':
                const minStockNum = parseInt(value);
                if (!value || isNaN(minStockNum)) {
                    return 'Minimum stock level is required and must be a number';
                }
                if (minStockNum < 0) {
                    return 'Minimum stock level cannot be negative';
                }
                if (!Number.isInteger(minStockNum)) {
                    return 'Minimum stock level must be a whole number';
                }
                if (minStockNum >= formData.quantityInStock) {
                    return 'Minimum stock level must be less than initial quantity';
                }
                break;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate all fields
        const newErrors: FormErrors = {};
        let hasErrors = false;

        Object.keys(formData).forEach((key) => {
            if (key !== 'quantity' && key !== 'minQuantity') {
                const error = validateField(key, formData[key as keyof FormData]);
                if (error) {
                    newErrors[key as keyof FormErrors] = error;
                    hasErrors = true;
                    toast.error(error);
                }
            }
        });

        setErrors(newErrors);

        if (!hasErrors) {
            onSubmit({
                ...formData,
                family,
            });
            toast.success('Medication added successfully!');
            onClose();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate on change
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal" style={{ padding: '20px' }}>
                <h2>Add New Medication</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <style>
                        {`
                            .error {
                                border: 2px solid #dc3545 !important;
                            }
                            .error-message {
                                color: #dc3545;
                                font-size: 0.875rem;
                                margin-top: 0.25rem;
                            }
                            .form-group {
                                margin-bottom: 1rem;
                            }
                            .form-group label {
                                display: block;
                                margin-bottom: 0.5rem;
                                font-weight: 500;
                            }
                            .form-group input {
                                width: 100%;
                                padding: 0.5rem;
                                border: 1px solid #ced4da;
                                border-radius: 0.25rem;
                            }
                            .form-group input:focus {
                                outline: none;
                                border-color: #86b7fe;
                                box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                            }
                        `}
                    </style>
                    <div className="form-group">
                        <label>Generic Name:</label>
                        <input
                            type="text"
                            name="genericName"
                            value={formData.genericName}
                            onChange={handleChange}
                            className={errors.genericName ? 'error' : ''}
                        />
                        {errors.genericName && 
                            <div className="error-message">{errors.genericName}</div>
                        }
                    </div>
                    <div className="form-group">
                        <label>Market Name:</label>
                        <input
                            type="text"
                            name="marketName"
                            value={formData.marketName}
                            onChange={handleChange}
                            className={errors.marketName ? 'error' : ''}
                        />
                        {errors.marketName && 
                            <div className="error-message">{errors.marketName}</div>
                        }
                    </div>
                    <div className="form-group">
                        <label>Dosage:</label>
                        <input
                            type="number"
                            name="dosage"
                            value={formData.dosage}
                            onChange={handleChange}
                            className={errors.dosage ? 'error' : ''}
                            min="0.1"
                            step="0.1"
                            placeholder="Enter dosage (number)"
                        />
                        {errors.dosage && 
                            <div className="error-message">{errors.dosage}</div>
                        }
                    </div>
                    <div className="form-group">
                        <label>Dosage Form:</label>
                        <input
                            type="text"
                            name="dosageForm"
                            value={formData.dosageForm}
                            onChange={handleChange}
                            className={errors.dosageForm ? 'error' : ''}
                            placeholder="Enter dosage form (text only)"
                        />
                        {errors.dosageForm && 
                            <div className="error-message">{errors.dosageForm}</div>
                        }
                    </div>
                    <div className="form-group">
                        <label>Expiry Date:</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className={errors.expiryDate ? 'error' : ''}
                        />
                        {errors.expiryDate && 
                            <div className="error-message">{errors.expiryDate}</div>
                        }
                    </div>
                    <div className="form-group">
                        <label>Pack Size:</label>
                        <input
                            type="number"
                            name="packSize"
                            value={formData.packSize}
                            onChange={handleChange}
                            className={errors.packSize ? 'error' : ''}
                            min="1"
                            step="1"
                            placeholder="Enter pack size (whole number)"
                        />
                        {errors.packSize && 
                            <div className="error-message">{errors.packSize}</div>
                        }
                    </div>
                    <div className="form-group">
                        <label>Initial Quantity:</label>
                        <input
                            type="number"
                            name="quantityInStock"
                            value={formData.quantityInStock}
                            onChange={handleChange}
                            className={errors.quantityInStock ? 'error' : ''}
                            min="0"
                            step="1"
                            placeholder="Enter initial quantity (whole number)"
                        />
                        {errors.quantityInStock && 
                            <div className="error-message">{errors.quantityInStock}</div>
                        }
                    </div>
                    <div className="form-group">
                        <label>Minimum Stock Level:</label>
                        <input
                            type="number"
                            name="minStockLevel"
                            value={formData.minStockLevel}
                            onChange={handleChange}
                            className={errors.minStockLevel ? 'error' : ''}
                            min="0"
                            step="1"
                            placeholder="Enter minimum stock level (whole number)"
                        />
                        {errors.minStockLevel && 
                            <div className="error-message">{errors.minStockLevel}</div>
                        }
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
