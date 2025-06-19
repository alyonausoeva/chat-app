import { useCurrentChat } from 'entities/sidebar-chat';
import { useState } from 'react';
import { ChatBox } from 'widgets/ChatBox';
import { SideBar } from 'widgets/Sidebar';

export const Chat = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  const { currentChat, updateCurrentChat } = useCurrentChat(setIsChatOpen);

  const onArrowClick = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="flex h-screen">
      <SideBar
        isChatOpen={isChatOpen}
        updateCurrentChat={updateCurrentChat}
        currentChat={currentChat}
      />
      <ChatBox isChatOpen={isChatOpen} onArrowClick={onArrowClick} currentChat={currentChat} />
    </div>
  );
};
