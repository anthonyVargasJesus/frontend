
export interface UserFirebase {
    uid: string;
    email: string;
    displayName?: string;
    emailVerified: boolean;
    password?: string;
    photoURL?: string;
    isStudent?: boolean;
    isParent?: boolean;
    isTeacher?: boolean;
    isAcademic?: boolean;
}
