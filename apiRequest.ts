/**
 * API Request utilities for the questions endpoint
 */

const BASE_URL = 'http://52.66.70.151:3000/poc/v1/';
const QUESTIONS_ENDPOINT = 'questions';

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
 * Fetch questions from the API
 * @param onSuccess - Callback function called with the questions data when request succeeds
 * @param onError - Callback function called when request fails
 */
export const Request = async (
  endpoint = '',
  method = 'GET',
  data = {},
  onSuccess: (questions: Question[]) => void,
  onError: (error: string) => void,
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: method === 'POST' ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();

    onSuccess(res);
  } catch (error) {
    onError(
      error instanceof Error ? error.message : 'Failed to fetch questions',
    );
  }
};

/**
 * Post a question to the API
 * @param question - The question data to send
 * @param onSuccess - Callback function called when request succeeds
 * @param onError - Callback function called when request fails
 */
export const postQuestion = async (
  question: Partial<Question>,
  onSuccess: (response: any) => void,
  onError: (error: string) => void,
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}${QUESTIONS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(question),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    console.error('API Error:', error);
    onError(error instanceof Error ? error.message : 'Failed to post question');
  }
};

/**
 * Get a specific question by ID
 * @param id - The question ID
 * @param onSuccess - Callback function called with the question data when request succeeds
 * @param onError - Callback function called when request fails
 */
export const getQuestionById = async (
  id: string,
  onSuccess: (question: Question) => void,
  onError: (error: string) => void,
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}${QUESTIONS_ENDPOINT}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    console.error('API Error:', error);
    onError(
      error instanceof Error ? error.message : 'Failed to fetch question',
    );
  }
};

/**
 * Update a question by ID
 * @param id - The question ID
 * @param updates - The updates to apply
 * @param onSuccess - Callback function called when request succeeds
 * @param onError - Callback function called when request fails
 */
export const updateQuestion = async (
  id: string,
  updates: Partial<Question>,
  onSuccess: (response: any) => void,
  onError: (error: string) => void,
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}${QUESTIONS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    console.error('API Error:', error);
    onError(
      error instanceof Error ? error.message : 'Failed to update question',
    );
  }
};

/**
 * Delete a question by ID
 * @param id - The question ID
 * @param onSuccess - Callback function called when request succeeds
 * @param onError - Callback function called when request fails
 */
export const deleteQuestion = async (
  id: string,
  onSuccess: () => void,
  onError: (error: string) => void,
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}${QUESTIONS_ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    onSuccess();
  } catch (error) {
    console.error('API Error:', error);
    onError(
      error instanceof Error ? error.message : 'Failed to delete question',
    );
  }
};
