import { createApiError } from './errors';

export interface DispenseResponse {
    message: string;
}

export async function dispenseTreat(): Promise<DispenseResponse> {
        // Get auth token from localStorage
        const authData = localStorage.getItem('auth');
        if (!authData) {
            throw new Error('Authentication required');
        }
        
        const { token } = JSON.parse(authData);
        
        const response = await fetch('/api/dispense', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
            const message = errorData.detail || 'Failed to dispense treat';
            throw createApiError(message, response.status);
        }

        return response.json();
}
