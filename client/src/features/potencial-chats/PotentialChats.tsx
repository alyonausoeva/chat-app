import { selectUser } from 'app/store';
import { EmojiAvatar } from 'shared/ui';
import { Loading } from 'shared/ui/Loading';

import { useFetchAllUsers, usePotentialChats } from './model';
import { PotentialChatsProps } from './types';

export const PotentialChats = ({ userChats, setUserChats }: PotentialChatsProps) => {
  const user = selectUser();
  const { users, loading, error: fetchError } = useFetchAllUsers();
  const {
    potentialChats,
    createChat,
    error: createError,
  } = usePotentialChats(users, userChats, user._id, setUserChats);

  if (fetchError) return <div>Error loading users</div>;
  if (createError) return <div>Error creating chat</div>;
  if (loading) return <Loading />;

  return (
    <>
      {potentialChats.map((chat) => (
        <button
          key={chat._id}
          onClick={() => createChat(chat._id)}
          className="flex rounded-md bg-gray-100 p-2 hover:cursor-pointer hover:bg-gray-50"
        >
          <EmojiAvatar avatar={chat?.avatar} />
          <div className="ml-4 flex-1 content-center text-xs">
            <span className="block">{chat?.name}</span>
          </div>
        </button>
      ))}
    </>
  );
};
