export type Department = 'dentist' | 'laboratory' | 'emergencies';

export type UserRole = 'department_admin' | 'department_user';

export interface User {
    id: string;
    name: string;
    email: string;
    department: Department;
    role: UserRole;
    status: 'active' | 'inactive';
    lastActive?: string;
}

export interface UserActivity {
    id: string;
    userId: string;
    action: string;
    timestamp: string;
    details: string;
}
