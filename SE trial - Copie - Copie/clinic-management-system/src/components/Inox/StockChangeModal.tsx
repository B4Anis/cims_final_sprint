import React, { useState, useEffect } from 'react';
import { NonConsumable } from '../../types/NonConsumable.types';
import { useActivityLog } from '../../hooks/useActivityLog';
import './Inoxs.css';
import { Inox } from './Inoxs';

interface User {
    userID: string;
    fullName: string;
    email: string;
    role: string;
    department: string;
}

interface StockChangeModalProps {
    inox: NonConsumable;
    changeType: 'addition' | 'consumption';
    onClose: () => void;
    onSubmit: (quantity: number) => void;
    currentUser: User;
}

export const StockChangeModal: React.FC<StockChangeModalProps> = ({
    inox,
    changeType,
    onClose,
    onSubmit,
    currentUser
}) => {
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use the user's userID property for activity logging
    const { logActivity } = useActivityLog(currentUser?.userID || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (!currentUser?.userID) {
                setError('User ID is required');
                setIsSubmitting(false);
                return;
            }

            if (changeType === 'consumption' && quantity > inox.quantity) {
                setError('Cannot consume more than available quantity');
                setIsSubmitting(false);
                return;
            }

            await logActivity({
                action: changeType === 'addition' ? 'Added Inox stock' : 'Consumed Inox stock',
                itemId:  Inox.name,
                itemName: Inox.name,
                quantity: quantity,
                details: reason || undefined
            });

            onSubmit(quantity);
            onClose();
        } catch (error) {
            console.error('Error during stock change:', error);
            setError(error instanceof Error ? error.message : 'Failed to log activity. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{changeType === 'addition' ? 'Add Stock' : 'Consume Stock'}</h2>
                <p className="Inox-name">{inox.name}</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            max={changeType === 'consumption' ? inox.quantity : undefined}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            required
                            disabled={isSubmitting}
                            aria-label="Quantity"
                            title="Enter quantity"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reason">Reason:</label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason for stock change..."
                            disabled={isSubmitting}
                            aria-label="Reason"
                            title="Enter reason for stock change"
                        />
                    </div>
                    <div className="modal-actions">
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : (changeType === 'addition' ? 'Add' : 'Consume')}
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