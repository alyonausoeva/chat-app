import { ReactNode } from 'react';

export const Alert = ({ children, ...props }: { children: ReactNode }) => (
  <div
    className="mt-8 rounded-xl border border-red-300 bg-red-100 px-4 py-2 text-sm text-red-600"
    {...props}
  >
    {children}
  </div>
);
