export type MedicationFamily = 'Family1' | 'Family2' | 'Family3' | 'Family4';

export interface Medication {
    id: string; // Unique identifier for the medication
    genericName: string; // Generic name of the medication
    marketName: string; // Market name of the medication
    family: MedicationFamily; // Family category to which the medication belongs
    quantity: number; // Current stock quantity
    minQuantity: number; // Minimum stock threshold
    dosage: string; // Dosage of the medication (e.g., 500mg)
    dosageForm: string; // Dosage form (e.g., Tablet, Syrup)
    packSize: number; // Number of items in a pack
    expiryDate: string; // Expiry date of the medication
    description?: string; // Optional description or additional notes
}

export interface StockChange {
    id: string; // Unique identifier for the stock change record
    medicationId: string; // ID of the medication being changed
    changeType: 'addition' | 'consumption'; // Type of stock change
    quantity: number; // Quantity added or consumed
    date: string; // Date of the stock change
    reason?: string; // Reason for the stock change (e.g., new stock arrival or usage)
}

export interface PurchaseOrderItem {
    medicationId: string; // ID of the medication being ordered
    name: string; // Name of the medication
    quantity: number; // Quantity to order
    unitPrice: number; // Unit price of the medication
}

export interface PurchaseOrder {
    id: string; // Unique identifier for the purchase order
    date: string; // Date of the purchase order
    items: PurchaseOrderItem[]; // List of medications being ordered
    status: 'pending' | 'approved' | 'completed'; // Status of the purchase order
    notes?: string; // Optional notes about the purchase order
}
