import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { Medication, MedicationFamily } from '../../types/medication.types';
import { MedicationTable } from './MedicationTable';
import { StockChangeModal } from './StockChangeModal';
import { EditMedicationModal } from './EditMedicationModal';
import { PurchaseOrderModal } from './PurchaseOrderModal';
import { StockReportModal } from './StockReportModal';
import { AddMedicationModal } from './AddMedicationModal';
import './Medications.css';
import SidebarMenu from '../SidebarMenu';

export const MedicationManagement: React.FC = () => {
    const { family } = useParams<{ family: string }>(); // Correct type for useParams
    const displayFamily = family
        ? family.replace('-', ' ').replace(/(^\w|\s\w)/g, (l: string) => l.toUpperCase()) as MedicationFamily
        : 'Family 1'; // TypeScript type annotation for 'l'

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

    useEffect(() => {
        const savedMedications = localStorage.getItem('medications');
        if (savedMedications) {
            const allMedications = JSON.parse(savedMedications);
            setMedications(allMedications.filter((med: Medication) => med.family === displayFamily));
        }
    }, [displayFamily]);

    useEffect(() => {
        const savedMedications = localStorage.getItem('medications');
        const allMedications = savedMedications ? JSON.parse(savedMedications) : [];
        const otherFamilies = allMedications.filter((med: Medication) => med.family !== displayFamily);
        localStorage.setItem('medications', JSON.stringify([...otherFamilies, ...medications]));
    }, [medications, displayFamily]);

    const handleStockChange = (medicationId: string, changeType: 'addition' | 'consumption') => {
        const medication = medications.find(med => med.id === medicationId);
        if (medication) {
            setSelectedMedication(medication);
            setStockChangeType(changeType);
            setIsStockChangeModalOpen(true);
        }
    };

    const handleStockChangeSubmit = (quantity: number) => {
        if (selectedMedication) {
            const updatedMedications = medications.map(med => {
                if (med.id === selectedMedication.id) {
                    return {
                        ...med,
                        quantity: stockChangeType === 'addition' 
                            ? med.quantity + quantity 
                            : med.quantity - quantity
                    };
                }
                return med;
            });
            setMedications(updatedMedications);
            setIsStockChangeModalOpen(false);
            setSelectedMedication(null);
        }
    };

    const handleEditMedication = (medicationId: string) => {
        const medication = medications.find(med => med.id === medicationId);
        if (medication) {
            setSelectedMedication(medication);
            setIsEditModalOpen(true);
        }
    };

    const handleEditSubmit = (updatedMedication: Medication) => {
        const updatedMedications = medications.map(med => 
            med.id === updatedMedication.id ? updatedMedication : med
        );
        setMedications(updatedMedications);
        setIsEditModalOpen(false);
        setSelectedMedication(null);
    };

    const handleAddMedication = (newMedication: Omit<Medication, 'id'>) => {
        const medication: Medication = {
            ...newMedication,
            id: Date.now().toString()
        };
        setMedications([...medications, medication]);
        setIsAddModalOpen(false);
    };

    const filteredMedications = medications.filter(medication =>
        medication.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.marketName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="medication-management">
            <SidebarMenu onCategoryChange={setCategory} />
            <div className="page-header">
                <div>
                    <h1>Medication Stock - {displayFamily}</h1>
                </div>
            </div>

            <div className="controls">
                <div className="left-controls">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search medications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button 
                        className="print-btn"
                        onClick={() => setIsStockReportModalOpen(true)}
                    >
                        Print Stock Report
                    </button>
                </div>
                <div className="right-controls">
                    <button 
                        className="add-medication-btn"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Medication
                    </button>
                    <button 
                        className="purchase-order-btn"
                        onClick={() => setIsPurchaseOrderModalOpen(true)}
                    >
                        Create Purchase Order
                    </button>
                </div>
            </div>

            <MedicationTable
                medications={filteredMedications}
                onStockChange={handleStockChange}
                onEdit={handleEditMedication}
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
                    onSubmit={handleAddMedication}
                />
            )}
        </div>
    );
};
