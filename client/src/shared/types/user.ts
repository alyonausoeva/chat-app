export type User = {
  _id: string;
  avatar: string;
  name: string;
};

export type Chat = {
  _id: string;
  members: string[];
};

export type Message = {
  _id: string;
  chatId: string;
  createdAt: Date;
  senderId: string;
  text: string;
};
