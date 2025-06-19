import { selectUser } from 'app/store';
import { setLastMessage } from 'features/messages';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { baseUrl, DISABLED_BUTTON, INPUT, PRIMIRY_BUTTON } from 'shared/constants';
import { Chat, JsonRpcRequest, JsonRpcResponse, Message } from 'shared/types';
import { io, Socket } from 'socket.io-client';

type MessageInputProps = {
  currentChat: Chat | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSendMessageError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const MessageInput = ({
  currentChat,
  setMessages,
  setSendMessageError,
}: MessageInputProps) => {
  const user = selectUser();
  const dispatch = useDispatch();

  const [value, setValue] = useState('');
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket || !user?._id) return;
    socket.emit('addNewUser', user._id);
  }, [socket]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onSend = async () => {
    if (!currentChat?._id || !user?._id) {
      setSendMessageError('Chat or user not found');
      return;
    }

    const rpcRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      method: 'createMessage',
      params: {
        chatId: currentChat._id,
        senderId: user._id,
        text: value.trim(),
      },
      id: Date.now(),
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpcRequest),
      });

      const data: JsonRpcResponse<Message> = await response.json();

      if (data.error) {
        setSendMessageError(data.error.message);
      } else if (data.result) {
        setNewMessage(data.result);

        setMessages((prev) => [...prev, data.result as Message]);
        dispatch(setLastMessage({ chatId: currentChat._id, message: data.result }));
        setValue('');
        setSendMessageError('');
      } else {
        setSendMessageError('Unknown error');
      }
    } catch (err) {
      setSendMessageError((err as Error).message);
    }
  };

  useEffect(() => {
    if (!socket || !newMessage) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id);

    socket.emit('sendMessage', { ...newMessage, recipientId });
  }, [newMessage]);

  useEffect(() => {
    if (!socket) return;

    socket.on('getMessage', (msg: Message) => {
      if (currentChat?._id !== msg.chatId) return;
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('getMessage');
    };
  }, [socket, currentChat]);

  const isDisabled = !value.trim();

  return (
    <div className="flex">
      <input
        className={`${INPUT} mr-4`}
        id="Message"
        placeholder="Message"
        value={value}
        onChange={onInputChange}
      />
      <button
        className={`${isDisabled ? DISABLED_BUTTON : PRIMIRY_BUTTON}`}
        onClick={onSend}
        disabled={isDisabled}
      >
        Send
      </button>
    </div>
  );
};
