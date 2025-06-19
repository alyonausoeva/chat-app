import { setUser } from 'entities/user';
import { Chat, LoginPage, RegisterPage } from 'pages';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { selectUser } from './store';

export const App = () => {
  const dispatch = useDispatch();
  const user = selectUser();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser && !user) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Chat /> : <LoginPage />} />
        <Route path="/register" element={user ? <Chat /> : <RegisterPage />} />
        <Route path="/" element={user ? <Chat /> : <LoginPage />} />
      </Routes>
    </>
  );
};
