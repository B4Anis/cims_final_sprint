import React, { useState } from 'react';
import { Consumable } from '../../types/consumable.types';
import './Consumables.css';

interface EditConsumablesModalProps {
    consumable: Consumable;
    onClose: () => void;
    onSubmit: (consumable: Consumable) => void;
}

export const EditConsumablesModal: React.FC<EditConsumablesModalProps> = ({
    consumable,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<Consumable>({
        ...consumable,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.category ||
            !formData.brand ||
            formData.quantity <= 0 ||
            formData.minStock < 0 ||
            !formData.expiryDate ||
            !formData.supplierName ||
            !formData.supplierContact
        ) {
            alert('Please fill out all fields correctly.');
            return;
        }

        console.log('Submitting Updated Consumable:', formData);
        console.log('Updated Data:', {
            name: formData.name,
            category: formData.category,
            brand: formData.brand,
            quantity: formData.quantity,
            minStock: formData.minStock,
            expiryDate: formData.expiryDate,
            supplierName: formData.supplierName,
            supplierContact: formData.supplierContact,
        });

        const updatedFormData = { ...formData };
        onSubmit(updatedFormData);
        onClose(); // Close modal after submission
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
                <h2>Edit Consumable</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter consumable name"
                            title="Enter the name of the consumable"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            placeholder="Enter category"
                            title="Enter the category of the consumable"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="brand">Brand:</label>
                        <input
                            type="text"
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            placeholder="Enter brand"
                            title="Enter the brand name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                            placeholder="Enter quantity"
                            title="Enter the quantity"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="minStock">Min Stock:</label>
                        <input
                            type="number"
                            id="minStock"
                            name="minStock"
                            value={formData.minStock}
                            onChange={handleChange}
                            min="0"
                            required
                            placeholder="Enter minimum stock level"
                            title="Enter the minimum stock level"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date:</label>
                        <input
                            type="date"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                            title="Select expiry date"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="supplierName">Supplier Name:</label>
                        <input
                            type="text"
                            id="supplierName"
                            name="supplierName"
                            value={formData.supplierName}
                            onChange={handleChange}
                            required
                            placeholder="Enter supplier name"
                            title="Enter the supplier name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="supplierContact">Supplier Contact:</label>
                        <input
                            type="text"
                            id="supplierContact"
                            name="supplierContact"
                            value={formData.supplierContact}
                            onChange={handleChange}
                            required
                            placeholder="Enter supplier contact"
                            title="Enter the supplier contact information"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="submit-btn">
                            Save Changes
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
