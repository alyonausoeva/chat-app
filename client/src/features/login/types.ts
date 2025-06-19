import { OnFormChange, OnFormSubmit } from 'shared/types';

export type LoginFormProps = {
  form: Record<string, string>;
  onChange: OnFormChange;
  onSubmit: OnFormSubmit;
  isLoading: boolean;
};
