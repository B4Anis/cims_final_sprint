import React, { useState } from 'react';
import { Inox, PurchaseOrderItem } from '../../types/Inox.types';
import './Inoxs.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PurchaseOrderModalProps {
    Inoxs: Inox[];
    onClose: () => void;
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
    Inoxs,
    onClose
}) => {
    const [items, setItems] = useState<PurchaseOrderItem[]>([]);
    const [notes, setNotes] = useState('');

    const addItem = () => {
        setItems(prev => [...prev, {
            inoxId: '',
            name: '',
            quantity: 0,
            deadline: ''
        }]);
    };

    const updateItem = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
        setItems(prev => prev.map((item, i) => {
            if (i === index) {
                if (field === 'inoxId') {
                    const inox = Inoxs.find(inx => inx.name === value);
                    return {
                        ...item,
                        inoxId: value as string,
                        name: inox?.name || ''
                    };
                }
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const removeItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const purchaseOrder = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items,
            notes
        };

        generatePDF(purchaseOrder);
        onClose();
    };

    const generatePDF = (purchaseOrder: any) => {
        const doc = new jsPDF();

        // Add header
        doc.setFontSize(18);
        doc.text('Purchase Order - Inox', 10, 10);

        // Add order details
        doc.setFontSize(12);
        doc.text(`Order ID: ${purchaseOrder.id}`, 10, 20);
        doc.text(`Date: ${new Date(purchaseOrder.date).toLocaleDateString()}`, 10, 30);

        if (purchaseOrder.notes) {
            doc.text(`Notes: ${purchaseOrder.notes}`, 10, 40);
        }

        // Add table for items
        const tableColumnHeaders = ['Inox Item', 'Quantity', 'Deadline'];
        const tableRows = purchaseOrder.items.map((item: PurchaseOrderItem) => [
            item.name,
            item.quantity,
            item.deadline
        ]);

        doc.autoTable({
            startY: 50,
            head: [tableColumnHeaders],
            body: tableRows,
        });

        // Save the PDF
        doc.save(`purchase_order_${purchaseOrder.id}.pdf`);
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
                                    value={item.inoxId}
                                    onChange={(e) => updateItem(index, 'inoxId', e.target.value)}
                                    required
                                >
                                    <option value="">Select Inox Item</option>
                                    {Inoxs.map(inox => (
                                        <option key={inox.name} value={inox.name}>
                                            {inox.name}
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
                                <input
                                    type="date"
                                    value={item.deadline}
                                    onChange={(e) => updateItem(index, 'deadline', e.target.value)}
                                    required
                                    className="deadline-input"
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