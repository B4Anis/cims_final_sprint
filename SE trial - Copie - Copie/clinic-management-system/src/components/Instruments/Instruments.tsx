import React, { useState, useEffect } from 'react';
import { Instrument } from '../../types/Instrument.types';
import { InstrumentsTable } from './InstrumentsTable';
import { StockChangeModal } from './StockChangeModal';
import { EditInstrumentsModal } from './EditInstrumentsModal';
import { PurchaseOrderModal } from './PurchaseOrderModal';
import { StockReportModal } from './StockReportModal';
import { AddInstrumentsModal } from './AddInstrumentsModal';
import './Instruments.css';
import SidebarMenu from '../SidebarMenu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getInstruments, addInstrument, updateInstrument, deleteInstrument } from '../../utils/api';

export const Instruments: React.FC = () => {
    const [category, setCategory] = useState<string>('instruments');
    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
    const [isStockChangeModalOpen, setIsStockChangeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPurchaseOrderModalOpen, setIsPurchaseOrderModalOpen] = useState(false);
    const [isStockReportModalOpen, setIsStockReportModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [stockChangeType, setStockChangeType] = useState<'addition' | 'consumption'>('addition');
    const [error, setError] = useState<string | null>(null);
    
    // Load instruments from API
    useEffect(() => {
        const fetchInstruments = async () => {
            try {
                const data = await getInstruments();
                setInstruments(data);
            } catch (err) {
                setError('Failed to fetch instruments');
                console.error('Error fetching instruments:', err);
            }
        };
        fetchInstruments();
    }, []);

    const handleStockChange = (instrumentName: string, changeType: 'addition' | 'consumption') => {
        const instrument = instruments.find((item) => item.name === instrumentName);
        if (instrument) {
            setSelectedInstrument(instrument);
            setStockChangeType(changeType);
            setIsStockChangeModalOpen(true);
        }
    };

    const handleStockChangeSubmit = async (quantity: number) => {
        if (selectedInstrument) {
            try {
                const updatedQuantity = stockChangeType === 'addition' 
                    ? selectedInstrument.quantity + quantity
                    : selectedInstrument.quantity - quantity;
                
                const updatedInstrument = {
                    ...selectedInstrument,
                    quantity: updatedQuantity
                };

                await updateInstrument(selectedInstrument.name, updatedInstrument);
                
                // Update local state after successful API call
                setInstruments(prevInstruments =>
                    prevInstruments.map(item =>
                        item.name === selectedInstrument.name ? updatedInstrument : item
                    )
                );
                
                setIsStockChangeModalOpen(false);
            } catch (err) {
                setError('Failed to update stock');
                console.error('Error updating stock:', err);
            }
        }
    };

    const handleAddInstrument = async (newInstrument: Instrument) => {
        try {
            await addInstrument(newInstrument);
            
            // Refresh the instruments list
            const updatedInstruments = await getInstruments();
            setInstruments(updatedInstruments);
            
            setIsAddModalOpen(false);
        } catch (err) {
            setError('Failed to add instrument');
            console.error('Error adding instrument:', err);
        }
    };

    const handleEditInstrument = async (updatedInstrument: Instrument) => {
        try {
            await updateInstrument(updatedInstrument.name, updatedInstrument);
            
            // Refresh the instruments list
            const updatedInstruments = await getInstruments();
            setInstruments(updatedInstruments);
            
            setIsEditModalOpen(false);
        } catch (err) {
            setError('Failed to update instrument');
            console.error('Error updating instrument:', err);
        }
    };

    const handleDeleteInstrument = async (name: string) => {
        try {
            await deleteInstrument(name);
            
            // Update local state after successful deletion
            setInstruments(prevConsumables =>
                prevConsumables.filter(item => item.name !== name)
            );
        } catch (err) {
            setError('Failed to delete instrument');
            console.error('Error deleting instrument:', err);
        }
    };

    const handlePrintStockReport = (date: string) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Instruments Stock Report', 14, 22);
        doc.setFontSize(12);
        doc.text(`Date: ${date}`, 14, 30);
    
        const tableColumn = ["Name", "Category", "modelNumber", "Quantity", "Min Stock", "Expiry Date", "Supplier Name", "Supplier Contact"];
        const tableRows: string[][] = []; // Ensure tableRows is a 2D array
    
        instruments.forEach((instrument) => {
            const instrumentData = [
                instrument.name || 'N/A',
                instrument.category || 'N/A',
                instrument.modelNumber || 'N/A',
                instrument.quantity !== undefined ? instrument.quantity.toString() : '0',
                instrument.minStock !== undefined ? instrument.minStock.toString() : '0',
                instrument.dateAquired || 'N/A',
                instrument.supplierName || 'N/A',
                instrument.supplierContact || 'N/A',
            ];
            tableRows.push(instrumentData); // Push instrumentData into tableRows
        });
    
        autoTable(doc, {
            head: [tableColumn], // Add column headers
            body: tableRows, // Add table data
            startY: 40,
        });
    
        const formattedDate = date.replace(/\//g, '-'); // Replace slashes with dashes
        doc.save(`Instruments_Report_${formattedDate}.pdf`); // Save the PDF
    };

    const handleEditClick = (instrumentName: string) => {
        const instrument = instruments.find((item) => item.name === instrumentName);
        if (instrument) {
            setSelectedInstrument(instrument);
            setIsEditModalOpen(true);
        }
    };

    const filteredInstruments = instruments.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="instruments-management">
            <SidebarMenu onCategoryChange={setCategory} />
            <div className="page-header">
                <h1>Instruments Stock</h1>
            </div>

            <div className="controls">
                <div className="left-controls">
                    <input
                        type="text"
                        placeholder="Search instruments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button onClick={() => handlePrintStockReport(new Date().toLocaleDateString())}>Print Stock Report</button>
                </div>
                <div className="right-controls">
                    <button className="add-instruments-btn" onClick={() => setIsAddModalOpen(true)}>
                        Add instruments
                    </button>
                    <button
                        className="purchase-order-btn"
                        onClick={() => setIsPurchaseOrderModalOpen(true)}
                    >
                        Create Purchase Order
                    </button>
                </div>
            </div>

            <InstrumentsTable
                instrument={filteredInstruments}
                onStockChange={handleStockChange}
                onEdit={handleEditClick}
            />

            {isStockChangeModalOpen && selectedInstrument && (
                <StockChangeModal
                    Instruments={selectedInstrument}
                    changeType={stockChangeType}
                    onClose={() => setIsStockChangeModalOpen(false)}
                    onSubmit={handleStockChangeSubmit}
                />
            )}

            {isEditModalOpen && selectedInstrument && (
                <EditInstrumentsModal
                    instrument={selectedInstrument}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditInstrument}
                />
            )}

            {isPurchaseOrderModalOpen && (
                <PurchaseOrderModal
                    Instrumentss={instruments}
                    onClose={() => setIsPurchaseOrderModalOpen(false)}
                />
            )}

            {isStockReportModalOpen && (
                <StockReportModal
                    Instrumentss={instruments}
                    onClose={() => setIsStockReportModalOpen(false)}
                />
            )}

            {isAddModalOpen && (
                <AddInstrumentsModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddInstrument}
                />
            )}
        </div>
    );
};
