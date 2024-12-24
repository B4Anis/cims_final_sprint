export interface Instrument {
    name: string;
    category: string;
    modelNumber : string;
    quantity: number;
    minStock: number;
    dateAquired: string;
    supplierName: string; // Update to lowercase 'supplierName'
    supplierContact: string;
}


export interface StockChange {
    id: string;
    medicationId: string;
    changeType: 'addition' | 'consumption';
    quantity: number;
    date: string;
    reason?: string;
}

export interface PurchaseOrderItem {
    medicationId: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

export interface PurchaseOrder {
    id: string;
    date: string;
    items: PurchaseOrderItem[];
    status: 'pending' | 'approved' | 'completed';
    notes?: string;
}
