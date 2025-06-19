import { setUser } from 'entities/user';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from 'shared/constants';

import { useRegisterForm } from './useRegisterForm';

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { registerInfo, registerError, setRegisterError, handleChange } = useRegisterForm();
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async () => {
    setIsLoading(true);
    setRegisterError(null);

    const body = {
      jsonrpc: '2.0',
      method: 'register',
      params: registerInfo,
      id: 1,
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        setRegisterError(data.error.message || 'Registration failed');
      } else if (data.result) {
        localStorage.setItem('user', JSON.stringify(data.result));
        dispatch(setUser(data.result));
        navigate('/');
      } else {
        setRegisterError('Unexpected response');
      }
    } catch (err) {
      setRegisterError('Network error');
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerUser();
  };

  return {
    registerInfo,
    registerError,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
