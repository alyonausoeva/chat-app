import { useEffect, useState } from 'react';
import { baseUrl } from 'shared/constants';
import { JsonRpcError, JsonRpcRequest, JsonRpcSuccess, User } from 'shared/types';

export const useFetchAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const body: JsonRpcRequest = {
        jsonrpc: '2.0',
        method: 'getUsers',
        params: {},
        id: 1,
      };

      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data: JsonRpcSuccess<User[]> | JsonRpcError = await response.json();

        if ('error' in data) {
          setError(data.error.message || 'Failed to fetch users');
          setUsers([]);
        } else if ('result' in data) {
          setUsers(data.result);
          setError(null);
        } else {
          setError('Unexpected response');
          setUsers([]);
        }
      } catch {
        setError('Network error');
        setUsers([]);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};
