import React, { useState } from 'react';
import { Medication } from '../../types/medication.types';
import './Medications.css';

/**
 * StockReportModal Component
 * Modal for generating and downloading stock reports
 * Provides PDF report of current medication inventory levels
 */
interface StockReportModalProps {
    medications: Medication[];
    onClose: () => void;
}

export const StockReportModal: React.FC<StockReportModalProps> = ({
    medications,
    onClose
}) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    /**
     * Handles report generation and download
     * Closes modal after successful generation
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        generatePDF();
    };

    /**
     * Generates PDF report of current stock levels
     * Includes medication details and highlights low stock items
     */
    const generatePDF = () => {
        // TODO: Implement PDF generation using a library like jsPDF
        console.log('Generating stock report PDF for date:', date);
        console.log('Medications:', medications);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Generate Stock Report</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="submit-btn">
                            Generate Report
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
