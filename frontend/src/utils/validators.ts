export const validateEmail = (email: string): boolean => {
    return /^\S+@\S+\.\S+$/.test(email);
};

export const validatePassword = (password: string): string | null => {
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
    if (!value.trim()) return `${fieldName} is required`;
    return null;
};

export const validateISBN = (isbn: string): boolean => {
    const cleaned = isbn.replace(/[-\s]/g, '');
    return cleaned.length === 10 || cleaned.length === 13;
};
