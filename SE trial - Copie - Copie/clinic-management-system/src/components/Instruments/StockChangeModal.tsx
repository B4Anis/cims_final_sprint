import React, { useState } from 'react';
import { Instrument } from '../../types/Instrument.types';
import { useActivityLog } from '../../hooks/useActivityLog';
import './Instruments.css';
import { Instruments } from './Instruments';

interface User {
    userID: string;
    fullName: string;
    email: string;
    role: string;
    department: string;
}

interface StockChangeModalProps {
    instrument: Instrument;
    changeType: 'addition' | 'consumption';
    onClose: () => void;
    onSubmit: (quantity: number) => void;
    currentUser: User;
}

export const StockChangeModal: React.FC<StockChangeModalProps> = ({
    instrument,
    changeType,
    onClose,
    onSubmit,
    currentUser
}) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [reason, setReason] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { logActivity } = useActivityLog(currentUser?.userID || '');

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            if (!currentUser?.userID) {
                setError('User ID is required');
                setIsSubmitting(false);
                return;
            }

            if (changeType === 'consumption' && quantity > instrument.quantity) {
                setError('Cannot consume more than available quantity');
                setIsSubmitting(false);
                return;
            }

            await logActivity({
                action: changeType === 'addition' ? 'Added instrument stock' : 'Consumed instrument stock',
                itemId: instrument.name,
                itemName: instrument.name,
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
                <p className="Consumables-name">{instrument.name}</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity to {changeType === 'addition' ? 'Add' : 'Consume'}:</label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            max={changeType === 'consumption' ? instrument.quantity : undefined}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
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
                           aria-label="Reason"
                            title="Enter reason for stock change"
                            placeholder="Please provide a reason for this stock change"
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