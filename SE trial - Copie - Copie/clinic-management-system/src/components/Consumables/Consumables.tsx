import React, { useState, useEffect } from 'react';
import { Consumable } from '../../types/consumable.types';
import { ConsumablesTable } from './ConsumablesTable';
import { StockChangeModal } from './StockChangeModal';
import { EditConsumablesModal } from './EditConsumablesModal';
import { PurchaseOrderModal } from './PurchaseOrderModal';
import { StockReportModal } from './StockReportModal';
import { AddConsumablesModal } from './AddConsumablesModal';
import { useAuth } from '../../context/AuthContext';
import { useActivityLog } from '../../hooks/useActivityLog';
import './Consumables.css';
import SidebarMenu from '../SidebarMenu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getConsumables, addConsumable, updateConsumable, deleteConsumable, updateConsumableStock } from '../../utils/api';

export const Consumables: React.FC = () => {
    const { user } = useAuth();
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
    
    const isDepUser = user?.role === 'department user';
    const { logActivity } = useActivityLog(user?.userID || '');
    
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

    const handleStockChange = (consumableId: string, type: 'addition' | 'consumption') => {
        if (!user) {
            setError('Please log in to make stock changes');
            return;
        }


        if (isDepUser && type === 'addition') {
            setError('Department users cannot add stock');
            return;
        }
        const consumable = consumables.find(item => item._id === consumableId|| item.name === consumableId );
        if (!consumable) {
            setError('Consumable not found');
            return;
        }
        setSelectedConsumable(consumable);
        setStockChangeType(type);
        setIsStockChangeModalOpen(true);
       
    };


    const handleStockChangeSubmit = async (quantity: number) => {
            if (selectedConsumable) {
                try {
                    // First update the backend
                    await updateConsumableStock(
                        selectedConsumable.name,
                        quantity,
                        stockChangeType
                    );
    
                    // If backend update successful, update the local state
                    const updatedConsumables = consumables.map(item => {
                        if (item._id === selectedConsumable._id) {
                            return {
                                ...item,
                                quantity: stockChangeType === 'addition'
                                    ? item.quantity + quantity
                                    : item.quantity - quantity
                            };
                        }
                        return item;
                    });
                    setConsumables(updatedConsumables);
                    setIsStockChangeModalOpen(false);
                } catch (error) {
                    setError(error instanceof Error ? error.message : 'Failed to update stock');
                    console.error('Error updating stock:', error);
                }
            }
        };

   const handleAddConsumable = async (newConsumable: Consumable) => {
           try {
               // First add to backend
               const addedConsumable = await addConsumable(newConsumable);
               
               // Log the activity
               await logActivity({
                   action: 'Added Consumable',
                   itemId: addedConsumable._id || '',
                   itemName: addedConsumable.name,
                   quantity: addedConsumable.quantity,
                   details: `Added new non-consumable: ${addedConsumable.name} (${addedConsumable.brand})`
               });
               
               // If successful, update local state
               setConsumables(prev => [...prev, addedConsumable]);
               setIsAddModalOpen(false);
           } catch (error) {
               setError(error instanceof Error ? error.message : 'Failed to add consumable');
               console.error('Error adding consumable:', error);
           }
       };
       
    const handleEditClick = (consumableName: string) => {
        console.log('Edit clicked for:', consumableName);
        const consumable = consumables.find(item => item.name === consumableName);
        if (consumable) {
            console.log('Found consumable:', consumable);
            setSelectedConsumable(consumable);
            setIsEditModalOpen(true);
            setError(null);
        } else {
            console.error('consumable not found:', consumableName);
            setError('consumable not found');
        }
    };
    const handleEditConsumable = async (updatedConsumable: Consumable) => {
        try {
            console.log('Updating non-consumable:', updatedConsumable);
            
            // Find the original non-consumable to compare changes
            const originalConsumable = consumables.find(item => item.name === updatedConsumable.name);
            if (!originalConsumable) {
                throw new Error('Original consumable not found');
            }
            // Update in backend
            const result = await updateConsumable(updatedConsumable.name, updatedConsumable);
            console.log('Update result:', result);

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
                itemId: result._id || '',
                itemName: result.name,
                quantity: result.quantity,
                details: `Updated ${result.name} - Changes: ${changes.join(', ')}`
            });

          // Update local state
          setConsumables(prevConsumables =>
            prevConsumables.map(item =>
                item.name === updatedConsumable.name ? result : item
            )
        );
        setIsEditModalOpen(false);
        setSelectedConsumable(null);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update non-consumable';
        console.error('Error updating consumable:', error);
        setError(errorMessage);
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
    
    const filteredConsumables = consumables.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <SidebarMenu onCategoryChange={setCategory} />
            <div className="Consumables-management">
                <div className="page-header">
                    <div className="breadcrumb">Home / Consumables</div>
                    <h1>Consumables Stock</h1>
                </div>

                <div className="content">
                    {error && (
                        <div className="error-message" style={{ margin: '10px 0', padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
                            {error}
                        </div>
                    )}
                    <div className="controls">
                        <div className="left-controls">
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Search consumables..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>
                        <div className="right-controls">
                            <button
                                className="print-btn"
                                onClick={() => setIsStockReportModalOpen(true)}
                            >
                                Generate Stock Report
                            </button>
                            {!isDepUser && (
                                <>
                                    <button
                                        className="purchase-order-btn"
                                        onClick={() => setIsPurchaseOrderModalOpen(true)}
                                    >
                                        Create Purchase Order
                                    </button>
                                    <button
                                        className="add-Consumables-btn"
                                        onClick={() => setIsAddModalOpen(true)}
                                    >
                                        Add Consumable
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="consumables-table-container">
                        <ConsumablesTable
                            consumable={filteredConsumables}
                            onStockChange={handleStockChange}
                            onEdit={handleEditClick}
                            isDepUser={isDepUser}
                        />
                    </div>

                    {isStockChangeModalOpen && selectedConsumable && (
                        <StockChangeModal
                            Consumables={selectedConsumable}
                            changeType={stockChangeType}
                            onClose={() => setIsStockChangeModalOpen(false)}
                            onSubmit={handleStockChangeSubmit}
                            currentUser={user!}
                        />
                    )}

                    {isEditModalOpen && selectedConsumable && (
                        <EditConsumablesModal
                            consumable={selectedConsumable}
                            onClose={() => {
                                setIsEditModalOpen(false);
                                setSelectedConsumable(null);
                                setError(null);
                            }}
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
                           currentUser={user!}
                        />
                    )}
                </div>
            </div>
        </>
    );
};
