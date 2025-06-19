import { selectUser } from 'app/store';
import { useFetchRecipent } from 'entities/user';
import { MessageInput, Messages, useMessages } from 'features/messages';
import backgroundImage from 'shared/assets/background.svg?url';
import { Chat } from 'shared/types';
import { Alert } from 'shared/ui';

import { Header, Loading, NotSelectedBlock } from './ui';

type ChatBoxProps = {
  isChatOpen: boolean;
  onArrowClick: () => void;
  currentChat: Chat | null;
};

export const ChatBox = ({ isChatOpen, onArrowClick, currentChat }: ChatBoxProps) => {
  const user = selectUser();

  const { recipent } = useFetchRecipent(currentChat, user);
  const { messages, setMessages, loading, error, setError, loadMore, hasMore } = useMessages(
    currentChat?._id
  );

  const withChat = recipent && !error;

  return (
    <div
      className={`${
        isChatOpen ? 'flex' : 'hidden md:flex'
      } relative h-full max-h-screen grow flex-col justify-between bg-gray-100 bg-center bg-repeat bg-blend-multiply`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header recipent={recipent} onArrowClick={onArrowClick} />
      {!recipent && <NotSelectedBlock />}
      {loading && <Loading />}
      {error && <Alert>{error}</Alert>}
      {withChat && (
        <>
          <Messages
            key={currentChat?._id}
            items={messages}
            user={user}
            currentChat={currentChat}
            loadMore={loadMore}
            hasMore={hasMore}
          />
          <div className="mx-2 my-4 lg:mx-40">
            <MessageInput
              currentChat={currentChat}
              setMessages={setMessages}
              setSendMessageError={setError}
            />
          </div>
        </>
      )}
    </div>
  );
};
