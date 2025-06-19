import { OnFormChange, OnFormSubmit } from 'shared/types';

export type RegisterFormProps = {
  registerInfo: RegisterInfo;
  onChange: OnFormChange;
  onSubmit: OnFormSubmit;
  isLoading: boolean;
};

export type RegisterInfo = {
  name: string;
  password: string;
  email: string;
};
