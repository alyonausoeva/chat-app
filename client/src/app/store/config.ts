import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from 'entities/user';
import { messagesReducer } from 'features/messages';
import { authReducer } from 'features/register';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
