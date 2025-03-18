export interface DispenseResponse {
    message: string;
}

export async function dispenseTreat(): Promise<DispenseResponse> {
    const response = await fetch('/api/dispense', {
        method: 'POST',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(error.detail || 'Failed to dispense treat');
    }

    return response.json();
}
