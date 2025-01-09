import React, { useState } from 'react';
import { Consumable } from '../../types/consumable.types';
import './Consumables.css';
import { isValidAlgerianPhoneNumber,isValidEmail,isValidName,isValidNumber } from '../Extra_Tools/functions';
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
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
  

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError(null);
            setIsSubmitting(true);
    
            try {
                // Validate form data
                if (
                    !formData.name ||
                    !formData.category ||
                    !formData.brand ||
                    formData.quantity <= 0 ||
                    formData.minStock < 0 ||
                    !formData.expiryDate ||
                    !formData.supplierName ||
                    !formData.supplierContact||
                    !isValidName(formData.name)||
                    !isValidName(formData.category)||
                    !isValidName(formData.brand)||
                    !isValidName(formData.supplierName)||
                    !isValidAlgerianPhoneNumber(formData.supplierContact)
            
            ) {
                    throw new Error('Please fill out all fields correctly.');
                }
    
                // Submit the updated data
                await onSubmit({
                    ...formData,
                    _id: consumable._id, // Preserve the original ID
                    quantity: Number(formData.quantity),
                    minStock: Number(formData.minStock)
                });
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred while updating');
                console.error('Error in form submission:', error);
            } finally {
                setIsSubmitting(false);
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
                <h2>Edit Consumable</h2>
                {error && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}
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
                            disabled
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
                    <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="cancel-btn"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
