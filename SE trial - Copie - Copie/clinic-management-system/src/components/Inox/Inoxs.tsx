import React, { useState, useEffect } from 'react';
import { Inox } from '../../types/Inox.types';
import { InoxsTable } from './InoxsTable';
import { StockChangeModal } from './StockChangeModal';
import { EditInoxsModal } from './EditInoxsModal';
import { PurchaseOrderModal } from './PurchaseOrderModal';
import { StockReportModal } from './StockReportModal';
import { AddInoxsModal } from './AddInoxsModal';
import './Inoxs.css';
import SidebarMenu from '../SidebarMenu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getInoxs, addInox, updateInox, deleteInox } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const Inoxs: React.FC = () => {
    const [category, setCategory] = useState<string>('Inoxs');
    const [Inoxs, setInoxs] = useState<Inox[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInox, setSelectedInox] = useState<Inox | null>(null);
    const [isStockChangeModalOpen, setIsStockChangeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPurchaseOrderModalOpen, setIsPurchaseOrderModalOpen] = useState(false);
    const [isStockReportModalOpen, setIsStockReportModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [stockChangeType, setStockChangeType] = useState<'addition' | 'consumption'>('addition');
    const [error, setError] = useState<string | null>(null);
    
    const { user } = useAuth();
    const isDepUser = user?.role === 'department user';
    
    useEffect(() => {
        const fetchInoxs = async () => {
            try {
                const data = await getInoxs();
                setInoxs(data);
            } catch (err) {
                setError('Failed to fetch Inoxs');
                console.error('Error fetching Inoxs:', err);
            }
        };
        fetchInoxs();
    }, []);

    const handleStockChange = (InoxName: string, changeType: 'addition' | 'consumption') => {
        // Department users can only consume, not add stock
        if (isDepUser && changeType === 'addition') {
            return;
        }

        const Inox = Inoxs.find((item) => item.name === InoxName);
        if (Inox) {
            setSelectedInox(Inox);
            setStockChangeType(changeType);
            setIsStockChangeModalOpen(true);
        }
    };

    const handleStockChangeSubmit = async (quantity: number) => {
        if (selectedInox) {
            try {
                const updatedQuantity = stockChangeType === 'addition' 
                    ? selectedInox.quantity + quantity
                    : selectedInox.quantity - quantity;
                
                const updatedInox = {
                    ...selectedInox,
                    quantity: updatedQuantity
                };

                await updateInox(selectedInox.name, updatedInox);
                
                // Update local state after successful API call
                setInoxs(prevInoxs =>
                    prevInoxs.map(item =>
                        item.name === selectedInox.name ? updatedInox : item
                    )
                );
                
                setIsStockChangeModalOpen(false);
            } catch (err) {
                setError('Failed to update stock');
                console.error('Error updating stock:', err);
            }
        }
    };

    const handleAddInox = async (newInox: Inox) => {
        try {
            await addInox(newInox);
            
            // Refresh the Inoxs list
            const updatedInoxs = await getInoxs();
            setInoxs(updatedInoxs);
            
            setIsAddModalOpen(false);
        } catch (err) {
            setError('Failed to add Inox');
            console.error('Error adding Inox:', err);
        }
    };

    const handleEditInox = async (updatedInox: Inox) => {
        try {
            await updateInox(updatedInox.name, updatedInox);
            
            // Refresh the Inoxs list
            const updatedInoxs = await getInoxs();
            setInoxs(updatedInoxs);
            
            setIsEditModalOpen(false);
        } catch (err) {
            setError('Failed to update Inox');
            console.error('Error updating Inox:', err);
        }
    };

    const handleDeleteInox = async (name: string) => {
        try {
            await deleteInox(name);
            
            // Update local state after successful deletion
            setInoxs(prevInoxs =>
                prevInoxs.filter(item => item.name !== name)
            );
        } catch (err) {
            setError('Failed to delete Inox');
            console.error('Error deleting Inox:', err);
        }
    };

    const handlePrintStockReport = (date: string) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Inoxs Stock Report', 14, 22);
        doc.setFontSize(12);
        doc.text(`Date: ${date}`, 14, 30);
    
        const tableColumn = ["Name", "Category", "Brand", "Quantity", "Min Stock", "Expiry Date", "Supplier Name", "Supplier Contact"];
        const tableRows: string[][] = []; // Ensure tableRows is a 2D array
    
        Inoxs.forEach((Inox) => {
            const InoxData = [
                Inox.name || 'N/A',
                Inox.category || 'N/A',
                Inox.brand || 'N/A',
                Inox.quantity !== undefined ? Inox.quantity.toString() : '0',
                Inox.minStock !== undefined ? Inox.minStock.toString() : '0',
                // Inox.expiryDate || 'N/A',
                Inox.supplierName || 'N/A',
                Inox.supplierContact || 'N/A',
            ];
            tableRows.push(InoxData); // Push InoxData into tableRows
        });
    
        autoTable(doc, {
            head: [tableColumn], // Add column headers
            body: tableRows, // Add table data
            startY: 40,
        });
    
        const formattedDate = date.replace(/\//g, '-'); // Replace slashes with dashes
        doc.save(`Inoxs_Report_${formattedDate}.pdf`); // Save the PDF
    };

    const handleEditClick = (InoxName: string) => {
        if (isDepUser) return;
        
        const Inox = Inoxs.find((item) => item.name === InoxName);
        if (Inox) {
            setSelectedInox(Inox);
            setIsEditModalOpen(true);
        }
    };

    const filteredInoxs = Inoxs.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="Inoxs-management">
            <SidebarMenu onCategoryChange={setCategory} />
            <div className="page-header">
                <h1>Inoxs Stock</h1>
            </div>

            <div className="controls">
                <div className="left-controls">
                    <input
                        type="text"
                        placeholder="Search Inoxs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button className='purchase-order-btn' onClick={() => handlePrintStockReport(new Date().toLocaleDateString())}>Generate Stock Report</button>
                </div>
                {!isDepUser && (
                    <div className="right-controls">
                        <button className="add-Inoxs-btn" onClick={() => setIsAddModalOpen(true)}>
                            Add Inoxs
                        </button>
                        <button
                            className="purchase-order-btn"
                            onClick={() => setIsPurchaseOrderModalOpen(true)}
                        >
                            Create Purchase Order
                        </button>
                    </div>
                )}
            </div>

            <InoxsTable
                Inox={filteredInoxs}
                onStockChange={handleStockChange}
                onEdit={handleEditClick}
                isDepUser={isDepUser}
            />

            {isStockChangeModalOpen && selectedInox && (
                <StockChangeModal
                    Inoxs={selectedInox}
                    changeType={stockChangeType}
                    onClose={() => setIsStockChangeModalOpen(false)}
                    onSubmit={handleStockChangeSubmit}
                />
            )}

            {isEditModalOpen && selectedInox && !isDepUser && (
                <EditInoxsModal
                    Inox={selectedInox}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditInox}
                />
            )}

            {isPurchaseOrderModalOpen && !isDepUser && (
                <PurchaseOrderModal
                    Inoxss={Inoxs}
                    onClose={() => setIsPurchaseOrderModalOpen(false)}
                />
            )}

            {isStockReportModalOpen && (
                <StockReportModal
                    Inoxss={Inoxs}
                    onClose={() => setIsStockReportModalOpen(false)}
                />
            )}

            {isAddModalOpen && !isDepUser && (
                <AddInoxsModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddInox}
                />
            )}
        </div>
    );
};
