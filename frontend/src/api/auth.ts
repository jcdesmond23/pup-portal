import { createApiError } from './errors';

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch('/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
        const message = errorData.detail || 'Failed to login';
        throw createApiError(message, response.status);
    }

    return response.json();
}
