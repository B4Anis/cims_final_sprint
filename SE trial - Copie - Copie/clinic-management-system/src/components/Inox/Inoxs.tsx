import React, { useState, useEffect } from 'react';
import { NonConsumable } from '../../types/NonConsumable.types';
import { InoxsTable } from './InoxsTable';
import { StockChangeModal } from './StockChangeModal';
import { EditInoxModal } from './EditInoxsModal';
import { PurchaseOrderModal } from './PurchaseOrderModal';
import { StockReportModal } from './StockReportModal';
import { AddInoxsModal } from './AddInoxsModal';
import { useAuth } from '../../context/AuthContext';
import { useActivityLog } from '../../hooks/useActivityLog';
import './Inoxs.css';
import SidebarMenu from '../SidebarMenu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getInoxs, addInox, updateInox, deleteNonConsumable, updateInoxStock } from '../../utils/api';

export const Inox: React.FC = () => {
    const { user } = useAuth();
    const [category, setCategory] = useState<string>('Inox');
    const [inox, setInox] = useState<NonConsumable[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNonConsumable, setSelectedNonConsumable] = useState<NonConsumable | null>(null);
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
        const fetchInox = async () => {
            try {
                const data = await getInoxs();
                setInox(data);
            } catch (err) {
                setError('Failed to fetch non-consumables');
                console.error('Error fetching non-consumables:', err);
            }
        };
        fetchInox();
    }, []);

    const handleStockChange = (inoxId: string, type: 'addition' | 'consumption') => {
        if (!user) {
            setError('Please log in to make stock changes');
            return;
        }
        
        // Department users can only consume, not add stock
        if (isDepUser && type === 'addition') {
            setError('Department users cannot add stock');
            return;
        }

        const nonConsumable = inox.find(item => item.name === inoxId || item.name === inoxId);
        if (!nonConsumable) {
            setError('Non-consumable not found');
            return;
        }

        setSelectedNonConsumable(nonConsumable);
        setStockChangeType(type);
        setIsStockChangeModalOpen(true);
    };

    const handleStockChangeSubmit = async (quantity: number) => {
        if (selectedNonConsumable) {
            try {
                // First update the backend
                await updateInoxStock(
                    selectedNonConsumable.name,
                    quantity,
                    stockChangeType
                );

                // If backend update successful, update the local state
                const updatedInox = inox.map(item => {
                    if (item._id === selectedNonConsumable._id) {
                        return {
                            ...item,
                            quantity: stockChangeType === 'addition'
                                ? item.quantity + quantity
                                : item.quantity - quantity
                        };
                    }
                    return item;
                });
                setInox(updatedInox);
                setIsStockChangeModalOpen(false);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to update stock');
                console.error('Error updating stock:', error);
            }
        }
    };

    const handleAddNonConsumable = async (newNonConsumable: NonConsumable) => {
        try {
            // First add to backend
            const addedNonConsumable = await addInox(newNonConsumable);
            
            // Log the activity
            await logActivity({
                action: 'Added non-consumable',
                itemId: addedNonConsumable._id || '',
                itemName: addedNonConsumable.name,
                quantity: addedNonConsumable.quantity,
                details: `Added new non-consumable: ${addedNonConsumable.name} (${addedNonConsumable.brand})`
            });
            
            // If successful, update local state
            setInox(prev => [...prev, addedNonConsumable]);
            setIsAddModalOpen(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to add non-consumable');
            console.error('Error adding non-consumable:', error);
        }
    };

    const handleEditClick = (nonConsumableName: string) => {
        console.log('Edit clicked for:', nonConsumableName);
        const nonConsumable = inox.find(item => item.name === nonConsumableName);
        if (nonConsumable) {
            console.log('Found non-consumable:', nonConsumable);
            setSelectedNonConsumable(nonConsumable);
            setIsEditModalOpen(true);
            setError(null);
        } else {
            console.error('Non-consumable not found:', nonConsumableName);
            setError('Non-consumable not found');
        }
    };

    const handleEditNonConsumable = async (updatedNonConsumable: NonConsumable) => {
        try {
            console.log('Updating non-consumable:', updatedNonConsumable);
            
            // Find the original non-consumable to compare changes
            const originalNonConsumable = inox.find(item => item.name === updatedNonConsumable.name);
            if (!originalNonConsumable) {
                throw new Error('Original non-consumable not found');
            }

            // Update in backend
            const result = await updateInox(updatedNonConsumable.name, updatedNonConsumable);
            console.log('Update result:', result);
            
            // Create a list of changes
            const changes: string[] = [];
            if (originalNonConsumable.category !== updatedNonConsumable.category) {
                changes.push(`category from "${originalNonConsumable.category}" to "${updatedNonConsumable.category}"`);
            }
            if (originalNonConsumable.brand !== updatedNonConsumable.brand) {
                changes.push(`brand from "${originalNonConsumable.brand}" to "${updatedNonConsumable.brand}"`);
            }
            if (originalNonConsumable.quantity !== updatedNonConsumable.quantity) {
                changes.push(`quantity from ${originalNonConsumable.quantity} to ${updatedNonConsumable.quantity}`);
            }
            if (originalNonConsumable.minStock !== updatedNonConsumable.minStock) {
                changes.push(`minimum stock from ${originalNonConsumable.minStock} to ${updatedNonConsumable.minStock}`);
            }
            if (originalNonConsumable.supplierName !== updatedNonConsumable.supplierName) {
                changes.push(`supplier name from "${originalNonConsumable.supplierName}" to "${updatedNonConsumable.supplierName}"`);
            }
            if (originalNonConsumable.supplierContact !== updatedNonConsumable.supplierContact) {
                changes.push(`supplier contact from "${originalNonConsumable.supplierContact}" to "${updatedNonConsumable.supplierContact}"`);
            }

            // Log the activity with specific changes
            await logActivity({
                action: 'Updated inox',
                itemId: result._id || '',
                itemName: result.name,
                quantity: result.quantity,
                details: `Updated ${result.name} - Changes: ${changes.join(', ')}`
            });

            // Update local state
            setInox(prevInox =>
                prevInox.map(item =>
                    item.name === updatedNonConsumable.name ? result : item
                )
            );
            setIsEditModalOpen(false);
            setSelectedNonConsumable(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update inox';
            console.error('Error updating inox:', error);
            setError(errorMessage);
        }
    };

    const handleDeleteNonConsumable = async (name: string) => {
        try {
            const nonConsumableToDelete = inox.find(item => item.name === name);
            if (!nonConsumableToDelete) {
                throw new Error('Inox not found');
            }

            // Delete from backend
            await deleteNonConsumable(name);
            
            // Log the activity
            await logActivity({
                action: 'Deleted Inox',
                itemId: nonConsumableToDelete._id || '',
                itemName: name,
                quantity: nonConsumableToDelete.quantity,
                details: `Deleted Inox: ${name}`
            });

            // Update local state
            setInox(prevInox =>
                prevInox.filter(item => item.name !== name)
            );
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete non-consumable');
            console.error('Error deleting non-consumable:', error);
        }
    };

    const handlePrintStockReport = (date: string) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Non-Consumables Stock Report', 14, 22);
        doc.setFontSize(12);
        doc.text(`Date: ${date}`, 14, 30);
    
        const tableColumn = ["Name", "Category", "Brand", "Quantity", "Min Stock", "Supplier Name", "Supplier Contact"];
        const tableRows: string[][] = [];
    
        inox.forEach((nonConsumable) => {
            const nonConsumableData = [
                nonConsumable.name || 'N/A',
                nonConsumable.category || 'N/A',
                nonConsumable.brand || 'N/A',
                nonConsumable.quantity !== undefined ? nonConsumable.quantity.toString() : '0',
                nonConsumable.minStock !== undefined ? nonConsumable.minStock.toString() : '0',
                nonConsumable.supplierName || 'N/A',
                nonConsumable.supplierContact || 'N/A',
            ];
            tableRows.push(nonConsumableData);
        });
    
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });
    
        const formattedDate = date.replace(/\//g, '-');
        doc.save(`Inox_Report_${formattedDate}.pdf`);
    };

    const filteredInox = inox.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <SidebarMenu onCategoryChange={setCategory} />
            <div className="Inox-management">
                <div className="page-header">
                    <div className="breadcrumb">Home /Inox</div>
                    <h1>Inox Stock</h1>
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
                                    placeholder="Search Inox..."
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
                                        className="add-Inox-btn"
                                        onClick={() => setIsAddModalOpen(true)}
                                    >
                                        Add Inox
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="non-consumables-table-container">
                        <InoxsTable
                            inoxItems={filteredInox}
                            onStockChange={handleStockChange}
                            onEdit={handleEditClick}
                            isDepUser={isDepUser}
                        />
                    </div>

                    {isStockChangeModalOpen && selectedNonConsumable && (
                        <StockChangeModal
                            inox={selectedNonConsumable}
                            changeType={stockChangeType}
                            onClose={() => setIsStockChangeModalOpen(false)}
                            onSubmit={handleStockChangeSubmit}
                            currentUser={user!}
                        />
                    )}

                    {isEditModalOpen && selectedNonConsumable && (
                        <EditInoxModal
                            nonConsumable={selectedNonConsumable}
                            onClose={() => {
                                setIsEditModalOpen(false);
                                setSelectedNonConsumable(null);
                                setError(null);
                            }}
                            onSubmit={handleEditNonConsumable}
                        />
                    )}

                    {isPurchaseOrderModalOpen && !isDepUser && (
                        <PurchaseOrderModal
                            Inoxss={inox}
                            onClose={() => setIsPurchaseOrderModalOpen(false)}
                        />
                    )}

                    {isStockReportModalOpen && (
                        <StockReportModal
                            Inoxss={inox}
                            onClose={() => setIsStockReportModalOpen(false)}
                        />
                    )}

                    {isAddModalOpen && !isDepUser && (
                        <AddInoxsModal
                            onClose={() => setIsAddModalOpen(false)}
                            onSubmit={handleAddNonConsumable}
                            currentUser={user!}
                        />
                    )}
                </div>
            </div>
        </>
    );
};
