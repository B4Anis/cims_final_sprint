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
import { getInstruments, addInstrument, updateInstrument, deleteInstrument, updateInstrumentStock } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useActivityLog } from '../../hooks/useActivityLog';

export const Instruments: React.FC = () => {
    const { user } = useAuth();
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
    
    const isDepUser = user?.role === 'department user';
    const { logActivity } = useActivityLog(user?.userID || '');
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



    const handleStockChange = (instrumentId: string, type: 'addition' | 'consumption') => {
        if (!user) {
            setError('Please log in to make stock changes');
            return;
        }


        if (isDepUser && type === 'addition') {
            setError('Department users cannot add stock');
            return;
        }
        const instrument = instruments.find(item =>  item._id === instrumentId || item.name === instrumentId );
        if (!instrument) {
            setError('Instrument not found');
            return;
        }
        setSelectedInstrument(instrument);
        setStockChangeType(type);
        setIsStockChangeModalOpen(true);
       
    };

   
     const handleStockChangeSubmit = async (quantity: number) => {
                if (selectedInstrument) {
                    try {
                        // First update the backend
                        await updateInstrumentStock(
                            selectedInstrument.name,
                            quantity,
                            stockChangeType
                        );
        
                        // If backend update successful, update the local state
                        const updatedInstrument = instruments.map(item => {
                            if (item.name === selectedInstrument.name) {
                                return {
                                    ...item,
                                    quantity: stockChangeType === 'addition'
                                        ? item.quantity + quantity
                                        : item.quantity - quantity
                                };
                            }
                            return item;
                        });
                        setInstruments(updatedInstrument);
                        setIsStockChangeModalOpen(false);
                    } catch (error) {
                        setError(error instanceof Error ? error.message : 'Failed to update stock');
                        console.error('Error updating stock:', error);
                    }
                }
            };

    const handleAddInstrument = async (newInstrument: Instrument) => {
       try {
                      // First add to backend
                      const addedInstrument = await addInstrument(newInstrument);
                      
                      // Log the activity
                      await logActivity({
                        action: 'Added Instrument',
                        itemId: addedInstrument._id || '',
                        itemName: addedInstrument.name,
                        quantity: addedInstrument.quantity,
                        details: `Added new instrument ${addedInstrument.name} with initial quantity ${newInstrument.quantity}`
                      });//here diff in line 114 with 112 of consum
                      
                      // If successful, update local state
                      setInstruments(prev => [...prev, addedInstrument]);
                      setIsAddModalOpen(false);
                  } catch (error) {
                      setError(error instanceof Error ? error.message : 'Failed to add instrument');
                      console.error('Error adding instrument:', error);
                  }
    };

    const handleEditClick = (InstrumentName: string) => {
        console.log('Edit clicked for:', InstrumentName);
        const instrument = instruments.find(item => item.name === InstrumentName);
        if (instrument) {
            console.log('Found Instrument :', instrument);
            setSelectedInstrument(instrument);
            setIsEditModalOpen(true);
            setError(null);
        } else {
            console.error('instrument not found:', InstrumentName);
            setError('instrument not found');
        }
    };
    const handleEditInstrument = async (updatedInstrument: Instrument) => {
       try {
                   console.log('Updating instruments:', updatedInstrument);
                   
                   // Find the original non-consumable to compare changes
                   const originalInstrument = instruments.find(item => item.name === updatedInstrument.name);
                   if (!originalInstrument) {
                       throw new Error('original Instrument not found');
                   }
                   // Update in backend
                   const result = await updateInstrument(updatedInstrument.name, updatedInstrument);
                   console.log('Update result:', result);
       
                   // Create a list of changes
                   const changes: string[] = [];
                   if (originalInstrument.category !== updatedInstrument.category) {
                       changes.push(`category from "${originalInstrument.category}" to "${updatedInstrument.category}"`);
                   }
                   if (originalInstrument.modelNumber !== updatedInstrument.modelNumber) {
                       changes.push(`modelNumber from "${originalInstrument.modelNumber}" to "${updatedInstrument.modelNumber}"`);
                   }
                   if (originalInstrument.quantity !== updatedInstrument.quantity) {
                       changes.push(`quantity from ${originalInstrument.quantity} to ${updatedInstrument.quantity}`);
                   }
                   if (originalInstrument.minStock !== updatedInstrument.minStock) {
                       changes.push(`minimum stock from ${originalInstrument.minStock} to ${updatedInstrument.minStock}`);
                   }
                   if (originalInstrument.dateAcquired !== updatedInstrument.dateAcquired) {
                       changes.push(`expiry date from "${originalInstrument.dateAcquired}" to "${updatedInstrument.dateAcquired}"`);
                   }
                   if (originalInstrument.supplierName !== updatedInstrument.supplierName) {
                       changes.push(`supplier name from "${originalInstrument.supplierName}" to "${updatedInstrument.supplierName}"`);
                   }
                   if (originalInstrument.supplierContact !== updatedInstrument.supplierContact) {
                       changes.push(`supplier contact from "${originalInstrument.supplierContact}" to "${updatedInstrument.supplierContact}"`);
                   }
       
                   // Log the edit activity
                   await logActivity({
                       action: 'Updated instrument',
                       itemId: result._id || '',
                       itemName: result.name,
                       quantity: result.quantity,
                       details: `Updated ${result.name} - Changes: ${changes.join(', ')}`
                   });
       
                 // Update local state
                 setInstruments(prevInstruments =>
                    prevInstruments.map(item =>
                       item.name === updatedInstrument.name ? result : item
                   )
               );
               setIsEditModalOpen(false);
               setSelectedInstrument(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update instrument';
            console.error('Error updating instrument:', error);
            setError(errorMessage);
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

    

    const filteredInstruments = instruments.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
<>
        <SidebarMenu onCategoryChange={setCategory} />
        <div className="instruments-management">
            <div className="page-header">
                <div className="breadcrumb">Home / Instruments</div>
                <h1>Instruments Stock</h1>
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
                        placeholder="Search instruments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                </div>
                    {/* <button onClick={() => handlePrintStockReport(new Date().toLocaleDateString())}>Print Stock Report</button> */}
                <div className="right-controls">
                <button
                                className="print-btn"
                                onClick={() => handlePrintStockReport(new Date().toLocaleDateString())}
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
                                        className="add-instruments-btn"
                                        onClick={() => setIsAddModalOpen(true)}
                                    >
                                        Add instrument
                                    </button>
                        </>
                    )}
                </div>
            </div>
            <div className="instruments-table-container"></div>
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
                    currentUser={user!}
                />
            )}

            {isEditModalOpen && selectedInstrument && (
                <EditInstrumentsModal
                    instrument={selectedInstrument}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedInstrument(null);
                        setError(null);
                    }}
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
                    currentUser={user!}
                />
            )}
        </div>
        </div>
    </>
   
    );
};
