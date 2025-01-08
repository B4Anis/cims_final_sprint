import React, { useState } from 'react';
import { Instrument } from '../../types/Instrument.types';
import './Instruments.css';

interface StockChangeModalProps {
    instrument: Instrument;
    changeType: 'addition' | 'consumption';
    onClose: () => void;
    onSubmit: (quantity: number) => void;
    currentUser: { fullName: string; role: string; } | null;
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }
        if (!reason.trim()) {
            alert('Please provide a reason for the stock change');
            return;
        }
        onSubmit(quantity);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{changeType === 'addition' ? 'Add Stock' : 'Consume Stock'}</h2>
                <p>Current Stock: {instrument.quantity}</p>
                <p>User: {currentUser?.fullName || 'Unknown'}</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity to {changeType === 'addition' ? 'Add' : 'Consume'}:</label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reason">Reason:</label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            placeholder="Please provide a reason for this stock change"
                        />
                    </div>
                    <div className="modal-buttons">
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