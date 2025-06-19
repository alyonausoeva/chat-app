import { Link } from 'react-router-dom';
import { DISABLED_BUTTON, INPUT, PRIMIRY_BUTTON } from 'shared/constants';

import { RegisterFormProps } from './types';

export const RegisterForm = ({
  registerInfo,
  onChange,
  onSubmit,
  isLoading,
}: RegisterFormProps) => {
  const isButtonDisabled = !registerInfo.name || !registerInfo.password || !registerInfo.email;

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-1 block font-medium text-gray-700">
            Full name
          </label>
          <input
            className={INPUT}
            id="name"
            name="name"
            value={registerInfo.name}
            onChange={onChange}
            required
            placeholder="Full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block font-medium text-gray-700">
            Email
          </label>
          <input
            className={INPUT}
            type="email"
            id="email"
            name="email"
            value={registerInfo.email}
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
            placeholder="Password"
            value={registerInfo.password}
            onChange={onChange}
            required
          />
        </div>
        <button className={isButtonDisabled ? DISABLED_BUTTON : PRIMIRY_BUTTON} type="submit">
          {isLoading ? 'Creating your account' : 'Sign up'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-700">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
};
