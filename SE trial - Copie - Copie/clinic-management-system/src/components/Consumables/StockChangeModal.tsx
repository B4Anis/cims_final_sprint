import React, { useState, useEffect } from 'react';
import { Consumable } from '../../types/consumable.types';
import { useActivityLog } from '../../hooks/useActivityLog';
import './Consumables.css';

interface User {
    userID: string;
    fullName: string;
    email: string;
    role: string;
    department: string;
}

interface StockChangeModalProps {
    Consumables: Consumable;
    changeType: 'addition' | 'consumption';
    onClose: () => void;
    onSubmit: (quantity: number) => void;
    currentUser: User;
}

export const StockChangeModal: React.FC<StockChangeModalProps> = ({
    Consumables,
    changeType,
    onClose,
    onSubmit,
    currentUser
}) => {
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { logActivity } = useActivityLog(currentUser?.userID || '');


    const handleSubmit =  async(e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (!currentUser?.userID) {
                setError('User ID is required');
                setIsSubmitting(false);
                return;
            }

            if (changeType === 'consumption' && quantity > Consumables.quantity) {
                setError('Cannot consume more than available quantity');
                setIsSubmitting(false);
                return;
            }

            await logActivity({
                action: changeType === 'addition' ? 'Added consumable stock' : 'Consumed consumable stock',
                itemId: Consumables.name,
                itemName: Consumables.name,
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
                <p className="Consumables-name">{Consumables.name}</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            max={changeType === 'consumption' ? Consumables.quantity : undefined}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            required
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
                            placeholder={changeType === 'addition' ? 'e.g., New stock arrival' : 'e.g., Patient treatment'}
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