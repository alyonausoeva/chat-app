import { useEffect, useState } from 'react';
import { baseUrl } from 'shared/constants';
import { JsonRpcRequest, JsonRpcResponse } from 'shared/types';

export const useLastMessage = (chatId?: string) => {
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) return;

    const fetchLastMessage = async () => {
      setError(null);

      const rpcRequest: JsonRpcRequest = {
        jsonrpc: '2.0',
        method: 'getLastMessage',
        params: { chatId },
        id: Date.now(),
      };

      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rpcRequest),
        });

        const data: JsonRpcResponse<any> = await response.json();

        if (data.error) {
          setError(data.error.message);
          setLastMessage(null);
        } else if (data.result) {
          setLastMessage(data.result);
        } else {
          setError('Unknown error');
          setLastMessage(null);
        }
      } catch (err) {
        setError((err as Error).message);
        setLastMessage(null);
      }
    };

    fetchLastMessage();
  }, [chatId]);

  return { lastMessage, error };
};
