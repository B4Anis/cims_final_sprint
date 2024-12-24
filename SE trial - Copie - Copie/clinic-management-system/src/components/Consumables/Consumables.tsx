import React, { useState, useEffect } from 'react';
import { Consumable } from '../../types/consumable.types';
import { ConsumablesTable } from './ConsumablesTable';
import { StockChangeModal } from './StockChangeModal';
import { EditConsumablesModal } from './EditConsumablesModal';
import { PurchaseOrderModal } from './PurchaseOrderModal';
import { StockReportModal } from './StockReportModal';
import { AddConsumablesModal } from './AddConsumablesModal';
import './Consumables.css';
import SidebarMenu from '../SidebarMenu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getConsumables, addConsumable, updateConsumable, deleteConsumable } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const Consumables: React.FC = () => {
    const [category, setCategory] = useState<string>('Consumables');
    const [consumables, setConsumables] = useState<Consumable[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedConsumable, setSelectedConsumable] = useState<Consumable | null>(null);
    const [isStockChangeModalOpen, setIsStockChangeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPurchaseOrderModalOpen, setIsPurchaseOrderModalOpen] = useState(false);
    const [isStockReportModalOpen, setIsStockReportModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [stockChangeType, setStockChangeType] = useState<'addition' | 'consumption'>('addition');
    const [error, setError] = useState<string | null>(null);
    
    const { user } = useAuth();
    const isDepUser = user?.role === 'department user';
    
    // Load consumables from API
    useEffect(() => {
        const fetchConsumables = async () => {
            try {
                const data = await getConsumables();
                setConsumables(data);
            } catch (err) {
                setError('Failed to fetch consumables');
                console.error('Error fetching consumables:', err);
            }
        };
        fetchConsumables();
    }, []);

    const handleStockChange = (consumableName: string, changeType: 'addition' | 'consumption') => {
        // Department users can only consume, not add stock
        if (isDepUser && changeType === 'addition') {
            return;
        }

        const consumable = consumables.find((item) => item.name === consumableName);
        if (consumable) {
            setSelectedConsumable(consumable);
            setStockChangeType(changeType);
            setIsStockChangeModalOpen(true);
        }
    };

    const handleStockChangeSubmit = async (quantity: number) => {
        if (selectedConsumable) {
            try {
                const updatedQuantity = stockChangeType === 'addition' 
                    ? selectedConsumable.quantity + quantity
                    : selectedConsumable.quantity - quantity;
                
                const updatedConsumable = {
                    ...selectedConsumable,
                    quantity: updatedQuantity
                };

                await updateConsumable(selectedConsumable.name, updatedConsumable);
                
                setConsumables(prevConsumables =>
                    prevConsumables.map(item =>
                        item.name === selectedConsumable.name ? updatedConsumable : item
                    )
                );
                
                setIsStockChangeModalOpen(false);
            } catch (err) {
                setError('Failed to update stock');
                console.error('Error updating stock:', err);
            }
        }
    };

    const handleAddConsumable = async (newConsumable: Consumable) => {
        try {
            await addConsumable(newConsumable);
            const updatedConsumables = await getConsumables();
            setConsumables(updatedConsumables);
            setIsAddModalOpen(false);
        } catch (err) {
            setError('Failed to add consumable');
            console.error('Error adding consumable:', err);
        }
    };

    const handleEditConsumable = async (updatedConsumable: Consumable) => {
        try {
            await updateConsumable(updatedConsumable.name, updatedConsumable);
            const updatedConsumables = await getConsumables();
            setConsumables(updatedConsumables);
            setIsEditModalOpen(false);
        } catch (err) {
            setError('Failed to update consumable');
            console.error('Error updating consumable:', err);
        }
    };

    const handleDeleteConsumable = async (name: string) => {
        try {
            await deleteConsumable(name);
            setConsumables(prevConsumables =>
                prevConsumables.filter(item => item.name !== name)
            );
        } catch (err) {
            setError('Failed to delete consumable');
            console.error('Error deleting consumable:', err);
        }
    };

    const handlePrintStockReport = (date: string) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Consumables Stock Report', 14, 22);
        doc.setFontSize(12);
        doc.text(`Date: ${date}`, 14, 30);
    
        const tableColumn = ["Name", "Category", "Brand", "Quantity", "Min Stock", "Expiry Date", "Supplier Name", "Supplier Contact"];
        const tableRows: string[][] = [];
    
        consumables.forEach((consumable) => {
            const consumableData = [
                consumable.name || 'N/A',
                consumable.category || 'N/A',
                consumable.brand || 'N/A',
                consumable.quantity !== undefined ? consumable.quantity.toString() : '0',
                consumable.minStock !== undefined ? consumable.minStock.toString() : '0',
                consumable.expiryDate || 'N/A',
                consumable.supplierName || 'N/A',
                consumable.supplierContact || 'N/A',
            ];
            tableRows.push(consumableData);
        });
    
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });
    
        const formattedDate = date.replace(/\//g, '-');
        doc.save(`Consumables_Report_${formattedDate}.pdf`);
    };

    const handleEditClick = (consumableName: string) => {
        if (isDepUser) return;
        
        const consumable = consumables.find((item) => item.name === consumableName);
        if (consumable) {
            setSelectedConsumable(consumable);
            setIsEditModalOpen(true);
        }
    };

    const filteredConsumables = consumables.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="consumables-management">
            <SidebarMenu onCategoryChange={setCategory} />
            <div className="page-header">
                <h1>Consumables Stock</h1>
            </div>

            <div className="controls">
                <div className="left-controls">
                    <input
                        type="text"
                        placeholder="Search Consumables..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button 
                        className='purchase-order-btn' 
                        onClick={() => handlePrintStockReport(new Date().toLocaleDateString())}
                    >
                        Generate Stock Report
                    </button>
                </div>
                {!isDepUser && (
                    <div className="right-controls">
                        <button 
                            className="add-consumables-btn" 
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Add Consumables
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

            <ConsumablesTable
                consumable={filteredConsumables}
                onStockChange={handleStockChange}
                onEdit={handleEditClick}
                isDepUser={isDepUser}
            />

            {isStockChangeModalOpen && selectedConsumable && (
                <StockChangeModal
                    Consumables={selectedConsumable}
                    changeType={stockChangeType}
                    onClose={() => setIsStockChangeModalOpen(false)}
                    onSubmit={handleStockChangeSubmit}
                />
            )}

            {isEditModalOpen && selectedConsumable && !isDepUser && (
                <EditConsumablesModal
                    consumable={selectedConsumable}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditConsumable}
                />
            )}

            {isPurchaseOrderModalOpen && !isDepUser && (
                <PurchaseOrderModal
                    Consumabless={consumables}
                    onClose={() => setIsPurchaseOrderModalOpen(false)}
                />
            )}

            {isStockReportModalOpen && (
                <StockReportModal
                    Consumabless={consumables}
                    onClose={() => setIsStockReportModalOpen(false)}
                />
            )}

            {isAddModalOpen && !isDepUser && (
                <AddConsumablesModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddConsumable}
                />
            )}
        </div>
    );
};
