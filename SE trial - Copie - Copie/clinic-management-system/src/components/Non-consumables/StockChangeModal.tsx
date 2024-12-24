import React, { useState } from 'react';
import { NonConsumable } from '../../types/NonConsumable.types';
import './NonConsumables.css';

interface StockChangeModalProps {
    nonConsumable: NonConsumable;
    changeType: 'addition' | 'consumption';
    onClose: () => void;
    onSubmit: (quantity: number) => void;
}

export const StockChangeModal: React.FC<StockChangeModalProps> = ({
    nonConsumable,
    changeType,
    onClose,
    onSubmit
}) => {
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (changeType === 'consumption' && quantity > nonConsumable.quantity) {
            alert('Cannot consume more than available quantity');
            return;
        }
        onSubmit(quantity);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{changeType === 'addition' ? 'Add Stock' : 'Consume Stock'}</h2>
                <p className="NonConsumables-name">{nonConsumable.name}</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            max={changeType === 'consumption' ? nonConsumable.quantity : undefined}
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