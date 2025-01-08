import React, { useState } from 'react';
import { NonConsumable } from '../../types/NonConsumable.types';
import { useActivityLog } from '../../hooks/useActivityLog';
import './NonConsumables.css';

interface User {
    userID: string;
    fullName: string;
}

interface AddNonConsumablesModalProps {
    onClose: () => void;
    onSubmit: (nonConsumable: NonConsumable) => void;
    currentUser: User;
}

export const AddNonConsumablesModal: React.FC<AddNonConsumablesModalProps> = ({
    onClose,
    onSubmit,
    currentUser
}) => {
    const [formData, setFormData] = useState<{
        name: string;
        category: string;
        brand: string;
        quantity: number;
        minStock: number;
        supplierName: string;
        supplierContact: string;
    }>({
        name: '',
        category: '',
        brand: '',
        quantity: 0,
        minStock: 0,
        supplierName: '',
        supplierContact: '',
    });

    const [error, setError] = useState<string | null>(null);
    const { logActivity } = useActivityLog(currentUser?.userID || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (!currentUser?.userID) {
                setError('User ID is required');
                return;
            }

            if (
                !formData.name ||
                !formData.category ||
                !formData.brand ||
                formData.quantity <= 0 ||
                formData.minStock < 0 ||
                !formData.supplierName ||
                !formData.supplierContact
            ) {
                setError('Please fill out all fields correctly.');
                return;
            }

            const newNonConsumable: NonConsumable = {
                name: formData.name,
                category: formData.category,
                brand: formData.brand,
                quantity: formData.quantity,
                minStock: formData.minStock,
                supplierName: formData.supplierName,
                supplierContact: formData.supplierContact,
            };

            // Log the activity first
            await logActivity({
                action: 'Added new non-consumable item',
                itemId: formData.name, // Using name as temporary ID since _id isn't available yet
                itemName: formData.name,
                quantity: formData.quantity,
                details: `Category: ${formData.category}, Brand: ${formData.brand}`
            });

            // Submit the new non-consumable
            onSubmit(newNonConsumable);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add non-consumable');
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
                <h2>Add New Non-Consumable</h2>
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
                        <button type="submit">Add Non-Consumable</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};