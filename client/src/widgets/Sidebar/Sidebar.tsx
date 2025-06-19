import { Bars3Icon, PencilIcon } from '@heroicons/react/24/outline';
import { selectUser } from 'app/store';
import { SidebarChat } from 'entities/sidebar-chat';
import { PotentialChats } from 'features/potencial-chats';
import React, { useEffect } from 'react';
import { BAR } from 'shared/constants';
import { Chat } from 'shared/types';
import { Alert, Loading } from 'shared/ui';

import { useToggleBar } from './hooks';
import { useSidebarResize, useUserChats } from './model';
import { Menu } from './ui';

type SideBarProps = {
  isChatOpen: boolean | null;
  updateCurrentChat: (chat: Chat | null) => void;
  currentChat: Chat | null;
};

export const SideBar = ({ isChatOpen, updateCurrentChat, currentChat }: SideBarProps) => {
  const { sidebarWidth, startResizing, setSidebarWidth } = useSidebarResize();
  const { userChats, setUserChats, loading, error } = useUserChats();
  const { isBarOpen: isMenuOpen, toggleBar: toggleMenu, barRef: menuRef } = useToggleBar();
  const {
    isBarOpen: isPotentialChatsOpen,
    toggleBar: tooglePotentialChats,
    barRef: potentialChatsRef,
  } = useToggleBar();

  const user = selectUser();

  useEffect(() => {
    if (!isChatOpen) {
      setSidebarWidth('100%');
    }
  }, [isChatOpen]);

  const withChats = Boolean(userChats?.length);

  return (
    <>
      <div
        className={`${isChatOpen ? 'hidden md:flex' : 'flex'} relative flex-col border-r border-gray-200`}
        style={{ width: sidebarWidth }}
      >
        {error && <Alert>{error}</Alert>}
        {!withChats && loading && <Loading />}
        <button
          className="relative mt-2 mb-2 ml-4 h-10 w-10 cursor-pointer text-gray-500 hover:text-gray-400"
          onClick={toggleMenu}
        >
          <Bars3Icon />
        </button>
        {isMenuOpen && (
          <div ref={menuRef}>
            <Menu />
          </div>
        )}
        {!withChats && <div className="flex h-full items-center justify-center">No chats yet</div>}
        {withChats && (
          <div className="flex flex-col">
            {userChats?.map((chat) => (
              <React.Fragment key={chat._id}>
                <SidebarChat
                  chat={chat}
                  user={user}
                  updateChat={updateCurrentChat}
                  currentChat={currentChat}
                />
              </React.Fragment>
            ))}
          </div>
        )}
        <button
          className="shadow-3xl absolute right-2 bottom-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-zinc-400 text-white hover:bg-zinc-300"
          onClick={tooglePotentialChats}
        >
          <PencilIcon className="relative h-5 w-5" />
        </button>
        {isPotentialChatsOpen && (
          <div
            className={`${BAR} right-2 bottom-20 h-[80vh] flex-col gap-2 overflow-y-scroll shadow-2xl`}
            ref={potentialChatsRef}
          >
            <PotentialChats userChats={userChats} setUserChats={setUserChats} />
          </div>
        )}
      </div>
      <div
        onMouseDown={startResizing}
        className="w-0.5 cursor-col-resize bg-gray-300 transition hover:bg-gray-400"
      />
    </>
  );
};
