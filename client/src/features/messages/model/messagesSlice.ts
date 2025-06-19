import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lastMessages: {},
};

type MessagesState = {
  lastMessages: Record<string, string>;
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setLastMessage: (state: MessagesState, action) => {
      const { chatId, message } = action.payload;

      state.lastMessages[chatId] = message;
    },
  },
});

export const { setLastMessage } = messagesSlice.actions;
export const messagesReducer = messagesSlice.reducer;
