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
    activityLog?: string[];
    lastLogin?: Date;
}

export interface UserActivity {
    id: string;
    userId: string;
    action: string;
    timestamp: string;
    details: string;
}
