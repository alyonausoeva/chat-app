import { Link } from 'react-router-dom';
import { DISABLED_BUTTON, INPUT, PRIMIRY_BUTTON } from 'shared/constants';

import { LoginFormProps } from './types';

export const LoginForm = ({ form, onChange, onSubmit, isLoading }: LoginFormProps) => {
  const isButtonDisabled = !form.email || !form.password;

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1 block font-medium text-gray-700">
            Email
          </label>
          <input
            className={INPUT}
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            placeholder="example@mail.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block font-medium text-gray-700">
            Password
          </label>
          <input
            className={INPUT}
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            placeholder="Password"
          />
        </div>
        <button
          className={isButtonDisabled ? DISABLED_BUTTON : PRIMIRY_BUTTON}
          type="submit"
          disabled={isLoading}
        >
          Log in
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-700">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
};
