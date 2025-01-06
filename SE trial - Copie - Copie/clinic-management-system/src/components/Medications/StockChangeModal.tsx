import React, { useState } from 'react';
import { Medication } from '../../types/medication.types';
import { useActivityLog } from '../../hooks/useActivityLog';
import './Medications.css';

interface StockChangeModalProps {
    medication: Medication;
    changeType: 'addition' | 'consumption';
    onClose: () => void;
    onSubmit: (quantity: number) => void;
    currentUser: { userID: string };
}

export const StockChangeModal: React.FC<StockChangeModalProps> = ({
    medication,
    changeType,
    onClose,
    onSubmit,
    currentUser
}) => {
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState('');
    const { logActivity } = useActivityLog(currentUser.userID);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (changeType === 'consumption' && quantity > medication.quantity) {
            alert('Cannot consume more than available quantity');
            return;
        }

        try {
            // Log the activity first
            await logActivity({
                action: changeType === 'addition' ? 'Added stock' : 'Consumed stock',
                itemId: medication.id,
                itemName: `${medication.genericName} (${medication.marketName})`,
                quantity: quantity,
                details: reason || undefined
            });

            // If activity logging was successful, update the stock
            onSubmit(quantity);
        } catch (error) {
            console.error('Error during stock change:', error);
            alert('Failed to log activity. Please try again.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{changeType === 'addition' ? 'Add Stock' : 'Consume Stock'}</h2>
                <p className="medication-name">{medication.genericName} ({medication.marketName})</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Quantity:</label>
                        <input
                            type="number"
                            min="1"
                            max={changeType === 'consumption' ? medication.quantity : undefined}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Reason:</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason for stock change..."
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="submit-btn">
                            {changeType === 'addition' ? 'Add' : 'Consume'}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
