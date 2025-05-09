import React, { useState } from 'react';
import { Inox } from '../../types/Inox.types';
import './Inoxs.css';
import { isValidAlgerianPhoneNumber,isValidEmail,isValidName,isValidNumber } from '../Extra_Tools/functions';// to import validation helper functions
interface EditInoxModalProps {
    Inox: Inox;
    onClose: () => void;
    onSubmit: (Inox: Inox) => void;
}

export const EditInoxModal: React.FC<EditInoxModalProps> = ({
    Inox,
    onClose,
    onSubmit,
}) => {
    // State to manage the form data, initialized with the current Inox data
    const [formData, setFormData] = useState<Inox>({
        ...Inox,
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
                formData.quantity < 0 ||
                formData.minStock < 0 ||
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
                
                quantity: Number(formData.quantity), // Ensure quantity is a number
                minStock: Number(formData.minStock)  // Ensure minStock is a number
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred while updating');
            console.error('Error in form submission:', error);
        } finally {
            setIsSubmitting(false);// to reset submission state
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'minStock'
                ? parseFloat(value) || 0
                : value,
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Non-Consumable</h2>
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
                            placeholder="Enter non-consumable name"
                            disabled // Name should not be editable as it's used as an identifier
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
                            required
                            min="0"
                            placeholder="Enter quantity"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="minStock">Minimum Stock Level:</label>
                        <input
                            type="number"
                            id="minStock"
                            name="minStock"
                            value={formData.minStock}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="Enter minimum stock level"
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
                        />
                    </div>
                    <div className="modal-buttons">
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
