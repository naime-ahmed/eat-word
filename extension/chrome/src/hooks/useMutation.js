import { useCallback, useState } from 'react';

export const useMutation = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /** 
   * Triggers the mutation.
   * @param {string} url - The API endpoint to send the request to.
   * @param {object} options - Configuration for the request.
   * @param {string} options.method - The HTTP method (e.g., 'POST', 'PUT').
   * @param {object} options.body - The request payload.
   * @param {boolean} [options.includeToken=false] - Set to true to include the auth token.
   * @param {object} [options.headers] - Any additional headers.
   */
  const mutate = useCallback(async (url, options) => {
    setLoading(true);
    setError(null);
    setData(null);

    // Prepare the final options to be sent to the background script
    const requestOptions = {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // The body must be stringified for the fetch API
      body: JSON.stringify(options.body),
    };

    try {
      if (options.includeToken) {
        const { accessToken } = await chrome.storage.local.get('accessToken');
        if (!accessToken) {
          throw new Error('Authentication token not found for a private request.');
        }
        requestOptions.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      if (options.credentials) {
        requestOptions.credentials = options.credentials;
      }

      const response = await chrome.runtime.sendMessage({
        type: 'api-request',
        url,
        options: requestOptions,
      });

      if (chrome.runtime.lastError) {
        throw new Error(chrome.runtime.lastError.message);
      }
      
      if (response && response.status && response.status >= 400) {
        throw response;
      }
      
      setData(response);
      setLoading(false);
      return response;
      
    } catch (err) {
      console.error('Mutation failed:', err);
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  return { mutate, data, loading, error };
};