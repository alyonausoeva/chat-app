import { useCallback, useEffect, useState } from 'react';
import { baseUrl } from 'shared/constants';
import { JsonRpcRequest, JsonRpcResponse, Message } from 'shared/types';

const PAGE_SIZE = 20;

type MessagesResponse = {
  messages: Message[];
  hasMore: boolean;
};

export const useMessages = (chatId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const getMessages = useCallback(async (currentChatId: string, beforeId?: string) => {
    setLoading(true);
    setError(null);

    const params: any = { chatId: currentChatId, limit: PAGE_SIZE };
    if (beforeId) {
      params.before = beforeId;
    }

    const rpcRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      method: 'getMessages',
      params,
      id: Date.now(),
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpcRequest),
      });

      const data: JsonRpcResponse<MessagesResponse> = await response.json();

      if (data.error) {
        setError(data.error.message);
        setLoading(false);
        return;
      }

      const fetchedMessages = data.result?.messages || [];
      const fetchedHasMore = data.result?.hasMore ?? false;

      setMessages((prev) => {
        const existingIds = new Set(prev.map((msg) => msg._id));
        const newMessages = fetchedMessages.filter((msg) => !existingIds.has(msg._id));
        return beforeId ? [...newMessages, ...prev] : newMessages;
      });

      setHasMore(fetchedHasMore);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!chatId) return;
    setMessages([]);
    setHasMore(true);
    getMessages(chatId);
  }, [chatId, getMessages]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore || !messages.length || !chatId) return;

    const oldestMessage = messages[0];
    if (!oldestMessage?._id) return;

    const beforeId = oldestMessage._id.toString();

    getMessages(chatId, beforeId);
  }, [loading, hasMore, messages, chatId, getMessages]);

  return {
    setMessages,
    setError,
    messages,
    loading,
    error,
    loadMore,
    hasMore,
  };
};
