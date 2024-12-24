import React, { useState } from 'react';
import { NonConsumable } from '../../types/NonConsumable.types';
import './NonConsumables.css';

interface AddNonConsumablesModalProps {
    onClose: () => void;
    onSubmit: (NonConsumable: NonConsumable) => void;
}

export const AddNonConsumablesModal: React.FC<AddNonConsumablesModalProps> = ({
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<{
        name: string;
        category: string;
        brand: string;
        quantity: number;
        minStock: number;
        // expiryDate: string;
        supplierName: string;
        supplierContact: string;
    }>({
        name: '',
        category: '',
        brand: '',
        quantity: 0,
        minStock: 0,
        // expiryDate: '',
        supplierName: '',
        supplierContact: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.category ||
            !formData.brand ||
            formData.quantity <= 0 ||
            formData.minStock < 0 ||
            // !formData.expiryDate ||
            !formData.supplierName ||
            !formData.supplierContact
        ) {
            alert('Please fill out all fields correctly.');
            return;
        }

        onSubmit({
            name: formData.name,
            category: formData.category,
            brand: formData.brand,
            quantity: formData.quantity,
            minStock: formData.minStock,
            // expiryDate: formData.expiryDate,
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
                <h2>Add New NonConsumables</h2>
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
                        <label htmlFor="brand">Brand:</label>
                        <input
                            id="brand"
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            aria-label="Brand"
                            placeholder="Enter brand"
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
                        <button type="submit" className="submit-btn">
                            Add NonConsumables
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