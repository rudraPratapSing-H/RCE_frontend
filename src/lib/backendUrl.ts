const backendBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL;

if (!backendBaseUrl) {
	throw new Error('VITE_API_BASE_URL is not set in the frontend environment.');
}

export const getBackendBaseUrl = () => backendBaseUrl;

export const getBackendUrl = (path: string) => new URL(path, backendBaseUrl).toString();