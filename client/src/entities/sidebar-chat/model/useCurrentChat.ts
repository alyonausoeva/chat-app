import { useEffect, useState } from 'react';
import { Chat } from 'shared/types';

const CURRENT_CHAT_KEY = 'currentChatId';

export const useCurrentChat = (setIsChatOpen?: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_CHAT_KEY);

    if (saved) {
      setCurrentChat(JSON.parse(saved));
    }
  }, []);

  const updateCurrentChat = (chat: Chat | null) => {
    setCurrentChat(chat);

    if (setIsChatOpen) {
      setIsChatOpen(true);
    }

    localStorage.setItem(CURRENT_CHAT_KEY, JSON.stringify(chat));
  };

  const clearCurrentChat = () => {
    setCurrentChat(null);

    localStorage.removeItem(CURRENT_CHAT_KEY);
  };

  return {
    currentChat,
    updateCurrentChat,
    clearCurrentChat,
  };
};
