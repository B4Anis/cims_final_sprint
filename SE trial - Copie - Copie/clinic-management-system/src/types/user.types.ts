export type Department = 'pharmacy' | 'dentistry' | 'laboratory';

export type UserRole = 'clinicadmin' | 'department admin' | 'department user';

export interface User {
    userID: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    department: Department;
    role: UserRole;
    password?: string;
    lastLogin?: Date;
}

export interface ActivityLog {
    _id?: string;
    action: string;
    itemId: string;
    itemName: string;
    quantity: number;
    timestamp: string;
    details?: string;
}

export interface UserActivity {
    userID: string;
    action: string;
    itemId: string;
    itemName: string;
    quantity: number;
    timestamp: string;
    details?: string;
}
