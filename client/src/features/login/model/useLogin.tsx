import { setUser } from 'entities/user';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from 'shared/constants';

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const login = async () => {
    setIsLoading(true);
    setError(null);

    const body = {
      jsonrpc: '2.0',
      method: 'login',
      params: { email: form.email, password: form.password },
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
        setError(data.error.message || 'Login failed');
      } else if (data.result) {
        localStorage.setItem('user', JSON.stringify(data.result));
        dispatch(setUser(data.result));
        navigate('/');
      } else {
        setError('Unexpected response');
      }
    } catch (err) {
      setError('Network error');
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return { form, isLoading, error, handleChange, handleSubmit };
};
