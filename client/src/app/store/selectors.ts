import { useSelector } from 'react-redux';
import { Message, User } from 'shared/types';

type Store = {
  messages: { lastMessages: Record<string, Message> };
  user: User;
};

export const selectCurrentMessages = () =>
  useSelector((state: Store) => state.messages.lastMessages);

export const selectUser = () => useSelector((state: Store) => state.user);
