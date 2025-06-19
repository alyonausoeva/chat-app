import { LoginForm, useLogin } from 'features/login';
import backgroundImage from 'shared/assets/background.svg?url';
import { FORM_BACKGROUND } from 'shared/constants';
import { Alert } from 'shared/ui';

export const LoginPage = () => {
  const { form, isLoading, error, handleChange, handleSubmit } = useLogin();

  return (
    <div className={FORM_BACKGROUND} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="mx-auto w-full max-w-md rounded-xl bg-white/60 p-6 sm:max-w-lg sm:p-8 md:max-w-xl lg:max-w-2xl">
        <h2 className="mb-6 text-center text-2xl font-semibold">Login</h2>
        <LoginForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
      {error && <Alert>{error}</Alert>}
    </div>
  );
};
