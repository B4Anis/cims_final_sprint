import React, { useState } from 'react';
import { Medication, PurchaseOrderItem } from '../../types/medication.types';
import './Medications.css';

interface PurchaseOrderModalProps {
    medications: Medication[];
    onClose: () => void;
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
    medications,
    onClose
}) => {
    const [items, setItems] = useState<PurchaseOrderItem[]>([]);
    const [notes, setNotes] = useState('');

    const addItem = () => {
        setItems(prev => [...prev, {
            medicationId: '',
            name: '',
            quantity: 0,
            unitPrice: 0 
        }]);
    };

    const removeItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
        setItems(prev => prev.map((item, i) => {
            if (i === index) {
                if (field === 'medicationId') {
                    const medication = medications.find(med => med.id === value);
                    return {
                        ...item,
                        medicationId: value as string,
                        name: medication?.genericName + ' (' + medication?.marketName + ')'
                    };
                }
                return { ...item, [field]: value };
            }
            return item;
        }));
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
                                    value={item.medicationId}
                                    onChange={(e) => updateItem(index, 'medicationId', e.target.value)}
                                    required
                                >
                                    <option value="">Select Medication</option>
                                    {medications.map(med => (
                                        <option key={med.id} value={med.id}>
                                            {med.genericName} ({med.marketName})
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
