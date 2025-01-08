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
import { useAuth } from '../../context/AuthContext';
import { useActivityLog } from '../../hooks/useActivityLog';

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

    const { user } = useAuth();
    const isDepUser = user?.role === 'department user';
    const { logActivity } = useActivityLog(user?.userID || '');

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
                
                // Log the activity
                await logActivity({
                    action: stockChangeType === 'addition' ? 'Stock Addition' : 'Stock Consumption',
                    itemId: selectedInstrument.name,
                    itemName: selectedInstrument.name,
                    quantity: quantity,
                    details: `${stockChangeType === 'addition' ? 'Added' : 'Consumed'} ${quantity} units of ${selectedInstrument.name}`
                });

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
            
            // Log the activity
            await logActivity({
                action: 'Add Instrument',
                itemId: newInstrument.name,
                itemName: newInstrument.name,
                quantity: newInstrument.quantity,
                details: `Added new instrument ${newInstrument.name} with initial quantity ${newInstrument.quantity}`
            });
            
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
            const originalInstrument = instruments.find(i => i.name === updatedInstrument.name);
            if (!originalInstrument) {
                throw new Error('Instrument not found');
            }

            await updateInstrument(updatedInstrument.name, updatedInstrument);

            // Track all field changes
            const changes = [];
            if (originalInstrument.name !== updatedInstrument.name) {
                changes.push(`name from "${originalInstrument.name}" to "${updatedInstrument.name}"`);
            }
            if (originalInstrument.category !== updatedInstrument.category) {
                changes.push(`category from "${originalInstrument.category}" to "${updatedInstrument.category}"`);
            }
            if (originalInstrument.modelNumber !== updatedInstrument.modelNumber) {
                changes.push(`model number from "${originalInstrument.modelNumber}" to "${updatedInstrument.modelNumber}"`);
            }
            if (originalInstrument.quantity !== updatedInstrument.quantity) {
                changes.push(`quantity from ${originalInstrument.quantity} to ${updatedInstrument.quantity}`);
            }
            if (originalInstrument.minStock !== updatedInstrument.minStock) {
                changes.push(`minimum stock from ${originalInstrument.minStock} to ${updatedInstrument.minStock}`);
            }
            if (originalInstrument.dateAcquired !== updatedInstrument.dateAcquired) {
                changes.push(`date acquired from ${originalInstrument.dateAcquired} to ${updatedInstrument.dateAcquired}`);
            }
            if (originalInstrument.supplierName !== updatedInstrument.supplierName) {
                changes.push(`supplier name from "${originalInstrument.supplierName}" to "${updatedInstrument.supplierName}"`);
            }
            if (originalInstrument.supplierContact !== updatedInstrument.supplierContact) {
                changes.push(`supplier contact from "${originalInstrument.supplierContact}" to "${updatedInstrument.supplierContact}"`);
            }

            // Log the activity with detailed changes
            await logActivity({
                action: 'Edit Instrument',
                itemId: updatedInstrument.name,
                itemName: updatedInstrument.name,
                quantity: updatedInstrument.quantity,
                details: `Modified instrument "${updatedInstrument.name}". Changes made: ${changes.join('; ')}`
            });

            // Update local state
            setInstruments(prevInstruments =>
                prevInstruments.map(instrument =>
                    instrument.name === updatedInstrument.name ? updatedInstrument : instrument
                )
            );
            
            setIsEditModalOpen(false);
        } catch (err) {
            setError('Failed to update instrument');
            console.error('Error updating instrument:', err);
        }
    };

    const handleDeleteInstrument = async (name: string) => {
        try {
            const instrumentToDelete = instruments.find(i => i.name === name);
            if (!instrumentToDelete) {
                throw new Error('Instrument not found');
            }

            await deleteInstrument(name);
            
            // Log the activity
            await logActivity({
                action: 'Delete Instrument',
                itemId: name,
                itemName: name,
                quantity: instrumentToDelete.quantity,
                details: `Deleted instrument ${name} (quantity was ${instrumentToDelete.quantity})`
            });

            // Update local state
            setInstruments(prevInstruments =>
                prevInstruments.filter(instrument => instrument.name !== name)
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
                instrument.dateAcquired || 'N/A',
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
                    {!isDepUser && (
                        <button className="add-instruments-btn" onClick={() => setIsAddModalOpen(true)}>
                            Add instruments
                        </button>
                    )}
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
                isDepUser={isDepUser}
            />

            {isStockChangeModalOpen && selectedInstrument && (
                <StockChangeModal
                    instrument={selectedInstrument}
                    changeType={stockChangeType}
                    onClose={() => setIsStockChangeModalOpen(false)}
                    onSubmit={handleStockChangeSubmit}
                    currentUser={user}
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
