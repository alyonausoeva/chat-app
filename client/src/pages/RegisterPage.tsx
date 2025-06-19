import { RegisterForm, useRegister } from 'features/register';
import backgroundImage from 'shared/assets/background.svg?url';
import { FORM_BACKGROUND } from 'shared/constants';
import { Alert } from 'shared/ui';

export const RegisterPage = () => {
  const { registerInfo, registerError, isLoading, handleChange, handleSubmit } = useRegister();

  return (
    <div className={FORM_BACKGROUND} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="mx-auto w-full max-w-md rounded-xl bg-white/50 p-6 sm:max-w-lg sm:p-8 md:max-w-xl lg:max-w-2xl">
        <h2 className="mb-6 text-center text-2xl font-semibold">Create account</h2>
        <RegisterForm
          registerInfo={registerInfo}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
      {registerError && <Alert>{registerError}</Alert>}
    </div>
  );
};
