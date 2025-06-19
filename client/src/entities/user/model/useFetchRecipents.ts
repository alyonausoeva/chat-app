import { useEffect, useState } from 'react';
import { baseUrl } from 'shared/constants';
import { Chat, JsonRpcRequest, JsonRpcSuccess, User } from 'shared/types';

interface JsonRpcError {
  jsonrpc: '2.0';
  error: { code: number; message: string; data?: any };
  id: number | string | null;
}

export const useFetchRecipent = (
  chat: Chat | null,
  user: User
): { recipent: User | null; error: string | null } => {
  const [recipent, setRecipent] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recipentId = chat?.members?.find((id: string) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!recipentId) {
        setRecipent(null);
        return;
      }

      const body: JsonRpcRequest = {
        jsonrpc: '2.0',
        method: 'getUser',
        params: { userId: recipentId },
        id: 1,
      };

      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data: JsonRpcSuccess<User> | JsonRpcError = await response.json();

        if ('error' in data) {
          setError(data.error.message || 'Failed to fetch user');
          setRecipent(null);
        } else if ('result' in data) {
          setRecipent(data.result);
          setError(null);
        } else {
          setError('Unexpected response');
          setRecipent(null);
        }
      } catch {
        setError('Network error');
        setRecipent(null);
      }
    };

    getUser();
  }, [recipentId]);

  return { recipent, error };
};
