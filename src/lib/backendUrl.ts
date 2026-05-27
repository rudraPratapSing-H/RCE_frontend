const backendBaseUrl = ((import.meta as any).env?.VITE_API_BASE_URL ?? '').trim();
const isAbsoluteBackendUrl = /^https?:\/\//i.test(backendBaseUrl);

if (!backendBaseUrl) {
	throw new Error('VITE_API_BASE_URL is not set in the frontend environment.');
}

export const getBackendBaseUrl = () => backendBaseUrl;

export const getBackendUrl = (path: string) => {
	if (isAbsoluteBackendUrl) {
		return new URL(path, backendBaseUrl).toString();
	}

	return path.startsWith('/') ? path : `/${path}`;
};