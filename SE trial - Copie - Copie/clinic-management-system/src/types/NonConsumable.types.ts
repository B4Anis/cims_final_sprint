export interface NonConsumable {
    _id?: string;
    name: string;
    category: string;
    brand : string;
    quantity: number;
    minStock: number;
    // expiryDate: string;
    supplierName: string; 
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
    nonConsumableId: string;
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
