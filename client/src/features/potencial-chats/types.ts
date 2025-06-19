import React from 'react';
import { Chat } from 'shared/types';

export type SetUserChats = React.Dispatch<React.SetStateAction<Chat[] | null>>;

export type PotentialChatsProps = {
  userChats: Chat[] | null;
  setUserChats: SetUserChats;
};
