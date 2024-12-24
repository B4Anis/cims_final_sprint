import React, { useState, useEffect } from 'react';
import { NonConsumable } from '../../types/NonConsumable.types';
import { NonConsumablesTable } from './NonConsumablesTable';
import { StockChangeModal } from './StockChangeModal';
import { EditNonConsumablesModal } from './EditNonConsumablesModal';
import { PurchaseOrderModal } from './PurchaseOrderModal';
import { StockReportModal } from './StockReportModal';
import { AddNonConsumablesModal } from './AddNonConsumablesModal';
import './NonConsumables.css';
import SidebarMenu from '../SidebarMenu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getNonConsumables, addNonConsumable, updateNonConsumable, deleteNonConsumable } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const NonConsumables: React.FC = () => {
    const [category, setCategory] = useState<string>('NonConsumables');
    const [nonConsumables, setNonConsumables] = useState<NonConsumable[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNonConsumable, setSelectedNonConsumable] = useState<NonConsumable | null>(null);
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
        const fetchNonConsumables = async () => {
            try {
                const data = await getNonConsumables();
                setNonConsumables(data);
            } catch (err) {
                setError('Failed to fetch non-consumables');
                console.error('Error fetching non-consumables:', err);
            }
        };
        fetchNonConsumables();
    }, []);

    const handleStockChange = (nonConsumableName: string, changeType: 'addition' | 'consumption') => {
        // Department users can only consume, not add stock
        if (isDepUser && changeType === 'addition') {
            return;
        }

        const nonConsumable = nonConsumables.find((item) => item.name === nonConsumableName);
        if (nonConsumable) {
            setSelectedNonConsumable(nonConsumable);
            setStockChangeType(changeType);
            setIsStockChangeModalOpen(true);
        }
    };

    const handleStockChangeSubmit = async (quantity: number) => {
        if (selectedNonConsumable) {
            try {
                const updatedQuantity = stockChangeType === 'addition' 
                    ? selectedNonConsumable.quantity + quantity
                    : selectedNonConsumable.quantity - quantity;
                
                const updatedNonConsumable = {
                    ...selectedNonConsumable,
                    quantity: updatedQuantity
                };

                await updateNonConsumable(selectedNonConsumable.name, updatedNonConsumable);
                
                setNonConsumables(prevNonConsumables =>
                    prevNonConsumables.map(item =>
                        item.name === selectedNonConsumable.name ? updatedNonConsumable : item
                    )
                );
                
                setIsStockChangeModalOpen(false);
            } catch (err) {
                setError('Failed to update stock');
                console.error('Error updating stock:', err);
            }
        }
    };

    const handleAddNonConsumable = async (newNonConsumable: NonConsumable) => {
        try {
            await addNonConsumable(newNonConsumable);
            const updatedNonConsumables = await getNonConsumables();
            setNonConsumables(updatedNonConsumables);
            setIsAddModalOpen(false);
        } catch (err) {
            setError('Failed to add non-consumable');
            console.error('Error adding non-consumable:', err);
        }
    };

    const handleEditNonConsumable = async (updatedNonConsumable: NonConsumable) => {
        try {
            await updateNonConsumable(updatedNonConsumable.name, updatedNonConsumable);
            const updatedNonConsumables = await getNonConsumables();
            setNonConsumables(updatedNonConsumables);
            setIsEditModalOpen(false);
        } catch (err) {
            setError('Failed to update non-consumable');
            console.error('Error updating non-consumable:', err);
        }
    };

    const handleDeleteNonConsumable = async (name: string) => {
        try {
            await deleteNonConsumable(name);
            setNonConsumables(prevNonConsumables =>
                prevNonConsumables.filter(item => item.name !== name)
            );
        } catch (err) {
            setError('Failed to delete non-consumable');
            console.error('Error deleting non-consumable:', err);
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
    
        nonConsumables.forEach((nonConsumable) => {
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
        doc.save(`NonConsumables_Report_${formattedDate}.pdf`);
    };

    const handleEditClick = (nonConsumableName: string) => {
        if (isDepUser) return;
        
        const nonConsumable = nonConsumables.find((item) => item.name === nonConsumableName);
        if (nonConsumable) {
            setSelectedNonConsumable(nonConsumable);
            setIsEditModalOpen(true);
        }
    };

    const filteredNonConsumables = nonConsumables.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <SidebarMenu onCategoryChange={setCategory} />
            <div className="NonConsumables-management">
                <div className="page-header">
                    <div className="breadcrumb">Home / Non-consumables</div>
                    <h1>Non-consumables Stock</h1>
                </div>

                <div className="controls">
                    <div className="left-controls">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search non-consumables..."
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
                                    className="add-NonConsumables-btn"
                                    onClick={() => setIsAddModalOpen(true)}
                                >
                                    Add Non-consumable
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="non-consumables-table-container">
                    <NonConsumablesTable
                        nonConsumable={filteredNonConsumables}
                        onStockChange={handleStockChange}
                        onEdit={handleEditClick}
                        isDepUser={isDepUser}
                    />
                </div>

                {isStockChangeModalOpen && selectedNonConsumable && (
                    <StockChangeModal
                        nonConsumable={selectedNonConsumable}
                        changeType={stockChangeType}
                        onClose={() => setIsStockChangeModalOpen(false)}
                        onSubmit={handleStockChangeSubmit}
                    />
                )}

                {isEditModalOpen && selectedNonConsumable && !isDepUser && (
                    <EditNonConsumablesModal
                        nonConsumable={selectedNonConsumable}
                        onClose={() => setIsEditModalOpen(false)}
                        onSubmit={handleEditNonConsumable}
                    />
                )}

                {isPurchaseOrderModalOpen && !isDepUser && (
                    <PurchaseOrderModal
                        nonConsumables={nonConsumables}
                        onClose={() => setIsPurchaseOrderModalOpen(false)}
                    />
                )}

                {isStockReportModalOpen && (
                    <StockReportModal
                        nonConsumables={nonConsumables}
                        onClose={() => setIsStockReportModalOpen(false)}
                    />
                )}

                {isAddModalOpen && !isDepUser && (
                    <AddNonConsumablesModal
                        onClose={() => setIsAddModalOpen(false)}
                        onSubmit={handleAddNonConsumable}
                    />
                )}
            </div>
        </>
    );
};
