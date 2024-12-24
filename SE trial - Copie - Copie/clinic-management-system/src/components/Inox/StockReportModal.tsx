import React, { useState } from 'react';
import { Inox } from '../../types/Inox.types';
import './Inoxs.css';

interface StockReportModalProps {
    Inoxss: Inox[];
    onClose: () => void;
}
//prints the stock report in pdf format
export const StockReportModal: React.FC<StockReportModalProps> = ({
    Inoxss,
    onClose
}) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        generatePDF();
    };

    const generatePDF = () => {
        // TODO: Implement PDF generation using a library like jsPDF
        console.log('Generating stock report PDF for date:', date);
        console.log('Inoxss:', Inoxss);
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
