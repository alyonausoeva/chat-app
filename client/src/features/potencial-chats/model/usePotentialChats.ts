import { useState } from 'react';
import { baseUrl } from 'shared/constants';
import { Chat, JsonRpcRequest, JsonRpcResponse, User } from 'shared/types';

import { SetUserChats } from '../types';

export const usePotentialChats = (
  users: User[],
  userChats: Chat[] | null,
  currentUserId: string,
  setUserChats: SetUserChats
) => {
  const [error, setError] = useState<string | null>(null);

  const potentialChats = users.filter((user) => {
    if (user._id === currentUserId) return false;
    return !userChats?.some((chat) => chat.members.includes(user._id));
  });

  const createChat = async (secondId: string) => {
    setError(null);

    const rpcRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      method: 'createChat',
      params: { firstId: currentUserId, secondId },
      id: Date.now(),
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpcRequest),
      });

      const data: JsonRpcResponse<Chat> = await response.json();

      if (data.error) {
        setError(data.error.message);
      } else if (data.result) {
        setUserChats((prev) => (prev ? [...prev, data.result as Chat] : [data.result as Chat]));
      } else {
        setError('Unknown error');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return { potentialChats, createChat, error };
};
