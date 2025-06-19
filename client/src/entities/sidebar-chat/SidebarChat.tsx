import { selectCurrentMessages } from 'app/store';
import { useFetchRecipent } from 'entities/user';
import { Chat, User } from 'shared/types';
import { EmojiAvatar } from 'shared/ui';

import { useLastMessage } from './model';

type SidebarChatProps = {
  chat: Chat;
  user: User;
  updateChat: (chat: Chat | null) => void;
  currentChat: Chat | null;
};

export const SidebarChat = ({ chat, user, updateChat, currentChat }: SidebarChatProps) => {
  const currentMessages = selectCurrentMessages();

  const { recipent } = useFetchRecipent(chat, user);
  const { lastMessage } = useLastMessage(chat._id);

  const currentMessage = currentMessages?.[chat._id];
  const isCurrent = currentChat?._id === chat?._id;
  const message = currentMessage?.text || lastMessage?.text || 'Нет сообщений';

  return (
    <button
      onClick={() => updateChat(chat)}
      className={`mx-2 my-0.5 flex rounded-md ${isCurrent ? 'bg-blue-100' : 'white'} p-2 hover:cursor-pointer hover:bg-sky-50`}
    >
      <EmojiAvatar avatar={recipent?.avatar} />
      <div className="ml-4 min-w-0 flex-1 content-center text-left text-xs">
        <span className="block">{recipent?.name}</span>
        <p className="truncate text-gray-400">{message}</p>
      </div>
    </button>
  );
};
