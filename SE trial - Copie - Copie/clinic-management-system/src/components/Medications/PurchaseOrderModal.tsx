import React, { useState } from 'react';
import { Medication, PurchaseOrderItem } from '../../types/medication.types';
import './Medications.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
            deadline: ''
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
            notes
        };

        // Generate PDF
        generatePDF(purchaseOrder);
        onClose();
    };

    const generatePDF = (purchaseOrder: any) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Purchase Order', 10, 10);

        doc.setFontSize(12);
        doc.text(`Order ID: ${purchaseOrder.id}`, 10, 20);
        doc.text(`Date: ${new Date(purchaseOrder.date).toLocaleDateString()}`, 10, 30);

        if (purchaseOrder.notes) {
            doc.text(`Notes: ${purchaseOrder.notes}`, 10, 40);
        }

        // Add table for items
        const tableColumnHeaders = ['Medication', 'Quantity', 'Deadline'];
        const tableRows = purchaseOrder.items.map((item: any) => [
            item.name,
            item.quantity,
            item.deadline
        ]);

        doc.autoTable({
            startY: 50,
            head: [tableColumnHeaders],
            body: tableRows,
        });

        // Save PDF
        doc.save(`Purchase_Order_${purchaseOrder.id}.pdf`);
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
                                    className='medication-select'
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
