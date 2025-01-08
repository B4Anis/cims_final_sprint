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
import { useActivityLog } from '../../hooks/useActivityLog';

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
    const { logActivity } = useActivityLog(user?.userID || '');
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

    const handleStockChangeSubmit = async (quantity: number, reason?: string) => {
        if (selectedConsumable) {
            try {
                const updatedQuantity = stockChangeType === 'addition' 
                    ? selectedConsumable.quantity + quantity
                    : selectedConsumable.quantity - quantity;
                
                const updatedConsumable = {
                    ...selectedConsumable,
                    quantity: updatedQuantity
                };

                const result = await updateConsumable(selectedConsumable.name, updatedConsumable);
                
                // Log the stock change activity
                await logActivity({
                    action: stockChangeType === 'addition' ? 'Added stock' : 'Consumed stock',
                    itemId: result._id || result.name,
                    itemName: result.name,
                    quantity: quantity,
                    details: `${stockChangeType === 'addition' ? 'Added' : 'Consumed'} ${quantity} units of ${result.name}${reason ? ` - Reason: ${reason}` : ''}`
                });

                setConsumables(prevConsumables =>
                    prevConsumables.map(item =>
                        item.name === selectedConsumable.name ? updatedConsumable : item
                    )
                );
                
                setIsStockChangeModalOpen(false);
                setSelectedConsumable(null);
            } catch (err) {
                setError('Failed to update stock');
                console.error('Error updating stock:', err);
            }
        }
    };

    const handleAddConsumable = async (newConsumable: Consumable) => {
        try {
            const result = await addConsumable(newConsumable);
            
            // Log the add activity
            await logActivity({
                action: 'Added consumable',
                itemId: result._id || result.name,
                itemName: result.name,
                quantity: result.quantity,
                details: `Added new consumable: ${result.name} (Initial stock: ${result.quantity})`
            });

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
            // Find the original consumable to compare changes
            const originalConsumable = consumables.find(item => item.name === updatedConsumable.name);
            if (!originalConsumable) {
                throw new Error('Original consumable not found');
            }

            const result = await updateConsumable(updatedConsumable.name, updatedConsumable);

            // Create a list of changes
            const changes: string[] = [];
            if (originalConsumable.category !== updatedConsumable.category) {
                changes.push(`category from "${originalConsumable.category}" to "${updatedConsumable.category}"`);
            }
            if (originalConsumable.brand !== updatedConsumable.brand) {
                changes.push(`brand from "${originalConsumable.brand}" to "${updatedConsumable.brand}"`);
            }
            if (originalConsumable.quantity !== updatedConsumable.quantity) {
                changes.push(`quantity from ${originalConsumable.quantity} to ${updatedConsumable.quantity}`);
            }
            if (originalConsumable.minStock !== updatedConsumable.minStock) {
                changes.push(`minimum stock from ${originalConsumable.minStock} to ${updatedConsumable.minStock}`);
            }
            if (originalConsumable.expiryDate !== updatedConsumable.expiryDate) {
                changes.push(`expiry date from "${originalConsumable.expiryDate}" to "${updatedConsumable.expiryDate}"`);
            }
            if (originalConsumable.supplierName !== updatedConsumable.supplierName) {
                changes.push(`supplier name from "${originalConsumable.supplierName}" to "${updatedConsumable.supplierName}"`);
            }
            if (originalConsumable.supplierContact !== updatedConsumable.supplierContact) {
                changes.push(`supplier contact from "${originalConsumable.supplierContact}" to "${updatedConsumable.supplierContact}"`);
            }

            // Log the edit activity
            await logActivity({
                action: 'Updated consumable',
                itemId: result._id || result.name,
                itemName: result.name,
                quantity: result.quantity,
                details: `Updated ${result.name} - Changes: ${changes.join(', ')}`
            });

            const updatedConsumables = await getConsumables();
            setConsumables(updatedConsumables);
            setIsEditModalOpen(false);
            setSelectedConsumable(null);
        } catch (err) {
            setError('Failed to update consumable');
            console.error('Error updating consumable:', err);
        }
    };

    const handleDeleteConsumable = async (name: string) => {
        try {
            const consumable = consumables.find(item => item.name === name);
            if (!consumable) {
                throw new Error('Consumable not found');
            }

            await deleteConsumable(name);

            // Log the delete activity
            await logActivity({
                action: 'Deleted consumable',
                itemId: consumable._id || consumable.name,
                itemName: consumable.name,
                quantity: consumable.quantity,
                details: `Deleted consumable: ${consumable.name} (Last quantity: ${consumable.quantity})`
            });

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
        
        const consumable = consumables.find(item => item.name === consumableName);
        if (consumable) {
            console.log('Found consumable:', consumable);
            setSelectedConsumable(consumable);
            setIsEditModalOpen(true);
            setError(null);
        } else {
            console.error('Consumable not found:', consumableName);
            setError('Consumable not found');
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
