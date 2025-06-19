import { selectUser } from 'app/store';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { baseUrl } from 'shared/constants';
import { Chat, JsonRpcRequest, JsonRpcResponse } from 'shared/types';

export const useUserChats = (): {
  userChats: Chat[] | null;
  setUserChats: Dispatch<SetStateAction<Chat[] | null>>;
  loading: boolean;
  error: string | null;
} => {
  const user = selectUser();

  const [userChats, setUserChats] = useState<Chat[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserChats = async () => {
      if (!user?._id) return;

      setLoading(true);
      setError(null);

      const rpcRequest: JsonRpcRequest = {
        jsonrpc: '2.0',
        method: 'getUsersChats',
        params: { userId: user._id },
        id: 1,
      };

      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rpcRequest),
        });

        const data: JsonRpcResponse<Chat[]> = await response.json();

        if (data.error) {
          setError(data.error.message);
          setUserChats(null);
        } else if (data.result) {
          setUserChats(data.result);
        } else {
          setError('Unknown error');
          setUserChats(null);
        }
      } catch (err) {
        setError((err as Error).message);
        setUserChats(null);
      }

      setLoading(false);
    };

    fetchUserChats();
  }, [user]);

  return {
    userChats,
    setUserChats,
    loading,
    error,
  };
};
