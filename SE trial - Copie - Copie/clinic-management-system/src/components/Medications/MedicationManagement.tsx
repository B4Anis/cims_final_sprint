import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Medication, MedicationFamily } from '../../types/medication.types';
import { MedicationTable } from './MedicationTable';
import { StockChangeModal } from './StockChangeModal';
import { EditMedicationModal } from './EditMedicationModal';
import { PurchaseOrderModal } from './PurchaseOrderModal';
import { StockReportModal } from './StockReportModal';
import { AddMedicationModal } from './AddMedicationModal';
import './Medications.css';
import SidebarMenu from '../SidebarMenu';
import { createMedication, deleteMedication, getAllMedications, updateMedication } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useActivityLog } from '../../hooks/useActivityLog';

export const MedicationManagement: React.FC = () => {
    const { family } = useParams<{ family: string }>();
    const displayFamily = family
        ? family.replace('-', '').replace(/(^\w|\s\w)/g, (l: string) => l.toUpperCase()) as MedicationFamily
        : 'Family1';
   
    const [category, setCategory] = useState<string>('medications');
    const [medications, setMedications] = useState<Medication[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
    const [isStockChangeModalOpen, setIsStockChangeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPurchaseOrderModalOpen, setIsPurchaseOrderModalOpen] = useState(false);
    const [isStockReportModalOpen, setIsStockReportModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [stockChangeType, setStockChangeType] = useState<'addition' | 'consumption'>('addition');

    const { user } = useAuth();
    const { logActivity } = useActivityLog(user?.userID || '');
    const isDepUser = user?.role === 'department user';

    // Load medications for the specific family from MongoDB
    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const apiFamily = displayFamily
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join('');

                const data = await getAllMedications(apiFamily);
                setMedications(data || []);
            } catch (error) {
                console.error('Error fetching medications:', error);
                setMedications([]);
            }
        };

        fetchMedications();
    }, [displayFamily, medications]);   

    // Add a new medication
    const addNewMedication = async (medication: Omit<Medication, 'id'>) => {
        try {
            const data = await createMedication({ ...medication, family: displayFamily }, displayFamily);
            setMedications([...medications, data]);
            
            // Log the activity
            await logActivity({
                action: 'add',
                itemId: data.id,
                itemName: medication.genericName,
                quantity: medication.quantity,
                details: `Added medication ${medication.genericName} (${medication.marketName}) to ${displayFamily}`
            });
        } catch (err) {
            console.error('Error creating medication:', err);
        }
    }

    // Edit an existing medication
    const handleEditSubmit = async (updatedMedication: Medication) => {
        const { id, family } = updatedMedication;
        try {
            const data = await updateMedication(family, id, updatedMedication);
            setMedications(medications.map(med => (med.id === id ? data : med)));
            setIsEditModalOpen(false);
            
            // Log the activity
            await logActivity({
                action: 'edit',
                itemId: id,
                itemName: updatedMedication.genericName,
                quantity: updatedMedication.quantity,
                details: `Updated medication ${updatedMedication.genericName} (${updatedMedication.marketName})`
            });
        } catch (error) {
            console.error('Error updating medication:', error);
        }
    };

    const handleEditMedication = (medicationId: string) => {
        const medication = medications.find(med => med.id === medicationId);
        if (medication) {
            setSelectedMedication(medication);
            setIsEditModalOpen(true);
        }
    };

    // Delete a medication
    const handleDeleteMedication = async (id: string) => {
        const medicationToDelete = medications.find(med => med.id === id);
        if (!medicationToDelete) return;

        try {
            await deleteMedication(displayFamily, id);
            setMedications(medications.filter(med => med.id !== id));
            
            // Log the activity
            await logActivity({
                action: 'delete',
                itemId: id,
                itemName: medicationToDelete.genericName,
                quantity: medicationToDelete.quantity,
                details: `Deleted medication ${medicationToDelete.genericName} (${medicationToDelete.marketName})`
            });
        } catch (err) {
            console.error('Error deleting medication:', err);
        }
    }

    // Stock change operations
    const handleStockChange = (medicationId: string, changeType: 'addition' | 'consumption') => {
        const medication = medications.find(med => med.id === medicationId);
        if (medication) {
            setSelectedMedication(medication);
            setStockChangeType(changeType);
            setIsStockChangeModalOpen(true);
        }
    };

    const handleStockChangeSubmit = async (quantity: number) => {
        if (selectedMedication) {
            const action = stockChangeType === 'addition' ? 'restock' : 'consume';
            const newQuantity = stockChangeType === 'addition'
                ? selectedMedication.quantity + quantity
                : selectedMedication.quantity - quantity;
            
            const updatedMedications = medications.map(med => {
                if (med.id === selectedMedication.id) {
                    return {
                        ...med,
                        quantity: newQuantity
                    };
                }
                return med;
            });
            
            setMedications(updatedMedications);
            setIsStockChangeModalOpen(false);
            
            // Log the activity
            await logActivity({
                action: action,
                itemId: selectedMedication.id,
                itemName: selectedMedication.genericName,
                quantity: quantity,
                details: `${action === 'restock' ? 'Added' : 'Consumed'} ${quantity} units of ${selectedMedication.genericName} (${selectedMedication.marketName})`
            });
            
            setSelectedMedication(null);
        }
    };

    // Filter medications based on search query
    const filteredMedications = medications.filter(medication =>
        medication &&
        medication.genericName &&
        medication.marketName &&
        (medication.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.marketName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="medication-management">
            <SidebarMenu onCategoryChange={setCategory} />
            <div className="page-header">
                <h1>Medication Stock - {displayFamily}</h1>
            </div>

            <div className="controls">
                <div className="left-controls">
                    <input
                        type="text"
                        placeholder="Search medications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button className='purchase-order-btn' onClick={() => setIsStockReportModalOpen(true)}>Print Stock Report</button>
                </div>
                <div className="right-controls">
                    {!isDepUser && (
                        <>
                            <button className='add-medication-btn' onClick={() => setIsAddModalOpen(true)}>Add Medication</button>
                            <button className='purchase-order-btn' onClick={() => setIsPurchaseOrderModalOpen(true)}>Create Purchase Order</button>
                        </>
                    )}
                </div>
            </div>

            <MedicationTable
                medications={filteredMedications}
                onStockChange={handleStockChange}
                onEdit={handleEditMedication}
                onDelete={handleDeleteMedication}
                isDepUser={isDepUser}
            />

            {isStockChangeModalOpen && selectedMedication && (
                <StockChangeModal
                    medication={selectedMedication}
                    changeType={stockChangeType}
                    onClose={() => setIsStockChangeModalOpen(false)}
                    onSubmit={handleStockChangeSubmit}
                />
            )}

            {isEditModalOpen && selectedMedication && (
                <EditMedicationModal
                    medication={selectedMedication}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditSubmit}
                />
            )}

            {isPurchaseOrderModalOpen && (
                <PurchaseOrderModal
                    medications={medications}
                    onClose={() => setIsPurchaseOrderModalOpen(false)}
                />
            )}

            {isStockReportModalOpen && (
                <StockReportModal
                    medications={medications}
                    onClose={() => setIsStockReportModalOpen(false)}
                />
            )}

            {isAddModalOpen && (
                <AddMedicationModal
                    family={displayFamily}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={addNewMedication}
                />
            )}
        </div>
    );
};
