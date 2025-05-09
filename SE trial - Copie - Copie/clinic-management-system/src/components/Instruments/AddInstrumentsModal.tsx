import React, { useState } from 'react';
import {Instrument} from '../../types/Instrument.types';
import './Instruments.css';
import { isValidAlgerianPhoneNumber,isValidEmail,isValidName,isValidNumber } from '../Extra_Tools/functions';
import { useActivityLog } from '../../hooks/useActivityLog';

interface User {
    userID: string;
    fullName: string;
}


interface AddInstrumentsModalProps {
    onClose: () => void;
    onSubmit: (instrument: Instrument) => void;
    currentUser: User; 
}


export const AddInstrumentsModal: React.FC<AddInstrumentsModalProps> = ({
    onClose,
    onSubmit,
    currentUser,
}) => {
    const [formData, setFormData] = useState<{
        name: string;
        category: string;
        modelNumber: string;
        quantity: number;
        minStock: number;
        dateAcquired: string;
        supplierName: string;
        supplierContact: string;
    }>({
        name: '',
        category: '',
        modelNumber: '',
        quantity: 0,
        minStock: 0,
        dateAcquired:'' ,
        supplierName: '',
        supplierContact: '',
    });

    const [error, setError] = useState<string | null>(null);
    const { logActivity } = useActivityLog(currentUser?.userID || '');


    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError(null); // Clear previous errors

            try {
                // Validate user ID
                if (!currentUser?.userID) {
                    setError('User ID is required');
                    return;
                }
            if (
                !formData.name ||
                !formData.category ||
                !formData.modelNumber ||
                formData.quantity <= 0 ||
                formData.minStock < 0 ||
                !formData.supplierName ||
                !formData.supplierContact||
                !isValidName(formData.name)||
                !isValidName(formData.category)||
                !isValidNumber(formData.modelNumber)||
                !isValidName(formData.supplierName)||
                !isValidAlgerianPhoneNumber(formData.supplierContact)
            ) {
                setError('Please fill out all fields correctly.');
                return;
            }
            const newInstrument: Instrument = {
                name: formData.name,
                category: formData.category,
                modelNumber: formData.modelNumber,
                quantity: formData.quantity,
                minStock: formData.minStock,
                dateAcquired: formData.dateAcquired,
                supplierName: formData.supplierName,
                supplierContact: formData.supplierContact,
            };
            await logActivity({
                action: 'Added new instrument item',
                itemId: formData.name, // Using name as temporary ID since _id isn't available yet
                itemName: formData.name,
                quantity: formData.quantity,
                details: `Category: ${formData.category}, modelNumber: ${formData.modelNumber}, dateAcquired: ${formData.dateAcquired}`
            });
    
            onSubmit(newInstrument);
            onClose(); // Close the modal after submission
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add consumable');
        }
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({

            ...prev,
            [name]:
                name === 'quantity' || name === 'minStock'
                    ? parseFloat(value) || 0
                    : value,
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Instrument</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            aria-label="Name"
                            placeholder="Enter name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <input
                            id="category"
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            aria-label="Category"
                            placeholder="Enter category"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="modelNumber">Model Number:</label>
                        <input
                            id="modelNumber"
                            type="text"
                            name="modelNumber"
                            value={formData.modelNumber}
                            onChange={handleChange}
                            required
                            aria-label="Model Number"
                            placeholder="Enter model number"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            id="quantity"
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                            aria-label="Quantity"
                            placeholder="Enter quantity"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="minStock">Min Stock:</label>
                        <input
                            id="minStock"
                            type="number"
                            name="minStock"
                            value={formData.minStock}
                            onChange={handleChange}
                            min="0"
                            required
                            aria-label="Minimum Stock"
                            placeholder="Enter minimum stock"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateAcquired">Date Acquired:</label>
                        <input
                            id="dateAcquired"
                            type="date"
                            name="dateAcquired"
                            value={formData.dateAcquired}
                            onChange={handleChange}
                            required
                            aria-label="Date Acquired"
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="supplierName">Supplier Name:</label>
                        <input
                            id="supplierName"
                            type="text"
                            name="supplierName"
                            value={formData.supplierName}
                            onChange={handleChange}
                            required
                            aria-label="Supplier Name"
                            placeholder="Enter supplier name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="supplierContact">Supplier Contact:</label>
                        <input
                            id="supplierContact"
                            type="text"
                            name="supplierContact"
                            value={formData.supplierContact}
                            onChange={handleChange}
                            required
                            aria-label="Supplier Contact"
                            placeholder="Enter supplier contact"
                        />
                    </div>
                    <div className="modal-actions">
                        {/* Submit and cancel buttons */}
                        <button type="submit" className="submit-btn">
                            Add Instrument
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
