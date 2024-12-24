import React, { useState } from 'react';
import {Instrument} from '../../types/Instrument.types';
import './Instruments.css';

interface AddInstrumentsModalProps {
    onClose: () => void;
    onSubmit: (instrument: Instrument) => void;
}

export const AddInstrumentsModal: React.FC<AddInstrumentsModalProps> = ({
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<{
        name: string;
        category: string;
        modelNumber: string;
        quantity: number;
        minStock: number;
        dateAquired: string;
        supplierName: string;
        supplierContact: string;
    }>({
        name: '',
        category: '',
        modelNumber: '',
        quantity: 0,
        minStock: 0,
        dateAquired: '',
        supplierName: '',
        supplierContact: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
    
            if (
                !formData.name ||
                !formData.category ||
                !formData.modelNumber ||
                formData.quantity <= 0 ||
                formData.minStock < 0 ||
                !formData.dateAquired ||
                !formData.supplierName ||
                !formData.supplierContact
            ) {
                alert('Please fill out all fields correctly.');
                return;
            }
    
            onSubmit({
                name: formData.name,
                category: formData.category,
                modelNumber: formData.modelNumber,
                quantity: formData.quantity,
                minStock: formData.minStock,
                dateAquired: formData.dateAquired,
                supplierName: formData.supplierName,
                supplierContact: formData.supplierContact,
            });
    
        onClose();
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
                        <label htmlFor="dateAquired">Date Acquired:</label>
                        <input
                            id="dateAquired"
                            type="date"
                            name="dateAquired"
                            value={formData.dateAquired}
                            onChange={handleChange}
                            required
                            aria-label="Date Aquired"
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
                        <button type="submit" className="submit-btn" >
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
