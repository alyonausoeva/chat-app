import { selectCurrentMessages } from 'app/store';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Chat, Message, User } from 'shared/types';

import { useScroll } from '../model';
import { Poop } from './PoopAnimation';
import { Rocket } from './RocketAnimation';

type MessagesProps = {
  items: Message[];
  user: User;
  currentChat: Chat | null;
  loadMore: () => void;
  hasMore: boolean;
};

type Rocket = {
  id: string;
  text: string;
};

const checkPoop = (message: string) => message.includes('\u{1F4A9}');

export const Messages = ({ items, user, currentChat, loadMore, hasMore }: MessagesProps) => {
  const [poopMessageId, setPoopMessageId] = useState<string | null>(null);
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const { containerRef, firstItemRef } = useScroll(items, loadMore, hasMore);
  const currentMessages = selectCurrentMessages();

  const currentMessage = currentChat?._id && currentMessages?.[currentChat._id];

  useEffect(() => {
    if (currentMessage) {
      if (checkPoop(currentMessage.text)) {
        setPoopMessageId(currentMessage._id);
      }

      setRockets((prev) => [...prev, { id: currentMessage._id, text: currentMessage.text }]);

      setTimeout(() => {
        setRockets((prev) => prev.filter((r: Rocket) => r.id !== currentMessage._id));
      }, 10000);
    }
  }, [currentMessage]);

  useEffect(() => {
    if (poopMessageId) {
      const timer = setTimeout(() => setPoopMessageId(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [poopMessageId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [currentMessage]);

  useEffect(() => {
    if (scrollRef.current && isFirstRender.current) {
      scrollRef.current.scrollIntoView({ behavior: 'auto' });

      isFirstRender.current = false;
    }
  }, [items.length]);

  const senderClassName = 'bg-white rounded-3xl p-3 max-w-[65%] self-end shadow-2xl break-words';
  const theOtherClassName =
    'bg-blue-600 text-white rounded-3xl p-3 max-w-[65%] self-start shadow-2xl break-words';

  return (
    <div
      ref={containerRef}
      className="scrollbar-hide flex flex-1 flex-col gap-2 overflow-y-auto p-2 text-sm lg:p-8"
    >
      {items?.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;
        const ref = isLast ? scrollRef : isFirst ? firstItemRef : null;

        return (
          <div
            key={item._id}
            className={item.senderId === user._id ? senderClassName : theOtherClassName}
            ref={ref}
          >
            <span>{item.text}</span>
            <span
              className={`${
                item.senderId === user._id ? 'text-gray-500' : 'text-gray-300'
              } ml-4 text-xs`}
            >
              {moment(item.createdAt).calendar()}
            </span>
          </div>
        );
      })}
      {poopMessageId && (
        <div className="absolute top-50 flex items-center justify-center self-center">
          <Poop />
        </div>
      )}
      {rockets.map((rocket: Rocket) => (
        <div key={rocket.id} className="h-full w-full">
          <Rocket message={rocket.text} />
        </div>
      ))}
    </div>
  );
};
