import React, { useState } from 'react';
import { NonConsumable, PurchaseOrderItem } from '../../types/NonConsumable.types';
import './NonConsumables.css';

interface PurchaseOrderModalProps {
    nonConsumables: NonConsumable[];
    onClose: () => void;
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
    nonConsumables,
    onClose
}) => {
    const [items, setItems] = useState<PurchaseOrderItem[]>([]);
    const [notes, setNotes] = useState('');

    const addItem = () => {
        // setItems(prev => [...prev, {
        //     NonConsumablesId: '',
        //     name: '',
        //     quantity: 0,
        //     unitPrice: 0 
        // }]);
    };
    

    const removeItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
        // setItems(prev => prev.map((item, i) => {
        //     if (i === index) {
        //         if (field === 'NonConsumablesId') {
        //             const NonConsumables = nonConsumables.find(med => med.id === value);
        //             return {
        //                 ...item,
        //                 NonConsumablesId: value as string,
        //                 name: NonConsumables?.name || ''
        //             };
        //         }
        //         return { ...item, [field]: value };
        //     }
        //     return item;
        // }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const purchaseOrder = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items,
            status: 'pending' as const,
            notes
        };
        
        // Generate PDF
        generatePDF(purchaseOrder);
        onClose();
    };

    const generatePDF = (purchaseOrder: any) => {
        // TODO: Implement PDF generation using a library like jsPDF
        console.log('Generating PDF for purchase order:', purchaseOrder);
    };

    return (
        <div className="modal-overlay">
            <div className="modal purchase-order-modal">
                <h2>Create Purchase Order</h2>
                <form onSubmit={handleSubmit}>
                    <div className="items-section">
                        <button type="button" onClick={addItem} className="add-item-btn">
                            Add Item
                        </button>
                        {items.map((item, index) => (
                            <div key={index} className="purchase-order-item">
                                <select
                                    // // value={item.NonConsumablesId}
                                    // onChange={(e) => updateItem(index, 'NonConsumablesId', e.target.value)}
                                    // required
                                >
                                    <option value="">Select NonConsumables</option>
                                    {nonConsumables.map(med => (
                                        <option key={item.name} value={item.name}>
                                            {med.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                    placeholder="Quantity"
                                    min="1"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="remove-item-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="form-group">
                        <label>Notes:</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes..."
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="submit-btn">
                            Generate Purchase Order
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
