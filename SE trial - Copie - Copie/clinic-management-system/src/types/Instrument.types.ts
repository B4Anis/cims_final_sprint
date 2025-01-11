export interface Instrument {
    _id?: string;
    name: string;
    category: string;
    modelNumber : string;
    quantity: number;
    minStock: number;
    dateAcquired: string; // Changed from dateAquired to dateAcquired to match backend
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
    instrumentId: string;
    name: string;
    quantity: number;
    deadline: string;
}

export interface PurchaseOrder {
    id: string;
    date: string;
    items: PurchaseOrderItem[];
    notes?: string;
}
