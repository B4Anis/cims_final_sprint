import React, { useState } from 'react';
import { Medication } from '../../types/medication.types';
import './Medications.css';

interface StockChangeModalProps {
    medication: Medication;
    changeType: 'addition' | 'consumption';
    onClose: () => void;
    onSubmit: (quantity: number) => void;
}

export const StockChangeModal: React.FC<StockChangeModalProps> = ({
    medication,
    changeType,
    onClose,
    onSubmit
}) => {
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (changeType === 'consumption' && quantity > medication.quantity) {
            alert('Cannot consume more than available quantity');
            return;
        }
        onSubmit(quantity);
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
                            placeholder={changeType === 'addition' ? 'e.g., New stock arrival' : 'e.g., Patient treatment'}
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
