import React, { useState } from 'react';
import { Consumable } from '../../types/consumable.types';
import './Consumables.css';
import { isValidAlgerianPhoneNumber, isValidEmail, isValidName, isValidNumber } from '../Extra_Tools/functions';
import { useActivityLog } from '../../hooks/useActivityLog';

interface User {
    userID: string;
    fullName: string;
}

// Define the type of props the component will accept
interface AddConsumablesModalProps {
    onClose: () => void; // Function to close the modal
    onSubmit: (consumable: Consumable) => void; // Function to handle form submission with the consumable data
    currentUser: User; // Current user information
}

// The functional component for adding new consumables
export const AddConsumablesModal: React.FC<AddConsumablesModalProps> = ({
    onClose,
    onSubmit,
    currentUser,
}) => {
    // State to manage the form data with default empty values
    const [formData, setFormData] = useState<{
        name: string;
        category: string;
        brand: string;
        quantity: number;
        minStock: number;
        expiryDate: string;
        supplierName: string;
        supplierContact: string;
    }>({
        name: '',
        category: '',
        brand: '',
        quantity: 0,
        minStock: 0,
        expiryDate: '',
        supplierName: '',
        supplierContact: '',
    });

    const [error, setError] = useState<string | null>(null);
    const { logActivity } = useActivityLog(currentUser?.userID || '');

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setError(null); // Clear previous errors

        try {
            // Validate user ID
            if (!currentUser?.userID) {
                setError('User ID is required');
                return;
            }

            // Validate the form data before submission
            if (
                !formData.name ||
                !formData.category ||
                !formData.brand ||
                formData.quantity <= 0 ||
                formData.minStock < 0 ||
                !formData.expiryDate ||
                !formData.supplierName ||
                !formData.supplierContact ||
                !isValidName(formData.name) ||
                !isValidName(formData.category) ||
                !isValidName(formData.brand) ||
                !isValidName(formData.supplierName) ||
                !isValidAlgerianPhoneNumber(formData.supplierContact)
            ) {
                setError('Please fill out all fields correctly.');
                return;
            }

            const newConsumable: Consumable = {
                name: formData.name,
                category: formData.category,
                brand: formData.brand,
                quantity: formData.quantity,
                minStock: formData.minStock,
                expiryDate: formData.expiryDate,
                supplierName: formData.supplierName,
                supplierContact: formData.supplierContact,
            };

            // Log the activity first
            await logActivity({
                action: 'Added new consumable item',
                itemId: formData.name, // Using name as temporary ID since _id isn't available yet
                itemName: formData.name,
                quantity: formData.quantity,
                details: `Category: ${formData.category}, Brand: ${formData.brand}, Expiry: ${formData.expiryDate}`
            });

            // Submit the form data to the parent component
            onSubmit(newConsumable);
            onClose(); // Close the modal after submission
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add consumable');
        }
    };

    // Handle input field changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            // Update the corresponding field in the state
            ...prev,
            [name]:
                name === 'quantity' || name === 'minStock'
                    ? parseFloat(value) || 0 // Parse number values for quantity and minStock
                    : value,
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Consumables</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Render each form input field with label and validation */}
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
                        <label htmlFor="expiryDate">Expiry Date:</label>
                        <input
                            id="expiryDate"
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                            aria-label="Expiry Date"
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
                            Add Consumables
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
