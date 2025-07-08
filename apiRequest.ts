/**
 * API Request utilities for the questions endpoint
 */

import axios, { AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'http://52.66.70.151:3000/poc/v1/';

export interface Question {
  id?: string;
  question?: string;
  answer?: string;
  category?: string;
  difficulty?: string;
  [key: string]: any; // Allow for additional properties
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Make API requests using axios
 * @param endpoint - API endpoint to call
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param data - Request body data for POST/PUT requests
 * @param onSuccess - Callback function called when request succeeds
 * @param onError - Callback function called when request fails
 */
export const Request = async (
  endpoint = '',
  method = 'GET',
  data = {},
  onSuccess: (response: any) => void,
  onError: (error: string) => void,
): Promise<void> => {
  try {
    const config = {
      method: method.toLowerCase(),
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...(method.toLowerCase() !== 'get' && { data }),
    };

    const response: AxiosResponse = await axios(config);

    onSuccess(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as any)?.message ||
        axiosError.message ||
        'Failed to make API request';
      onError(errorMessage);
    } else {
      onError(
        error instanceof Error ? error.message : 'Unknown error occurred',
      );
    }
  }
};
