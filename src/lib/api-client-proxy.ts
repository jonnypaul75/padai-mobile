import axios, { AxiosError, type AxiosRequestConfig, type Method } from 'axios';

// Create an Axios instance with a base URL from .env
const api2 = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL_PROXY,
    withCredentials: true, // if your API needs cookies/auth sessions
});

// Generic request function
export async function apiProxyRequest<TResponse, TBody>(
    method: Method,
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig
): Promise<TResponse> {
    try {
        const response = await api2.request<TResponse>({
            method,
            url,
            ...(data && { data }),
            ...config,
        });

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message?: string }>;
            console.error(`[API ERROR]: ${axiosError.response?.status} - ${axiosError.message}`);
            // Throw a consistent error object
            throw {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.response?.data?.message || axiosError.message,
            };
        }
        console.error('[UNEXPECTED ERROR]:', error);
        throw error;
    }
}
