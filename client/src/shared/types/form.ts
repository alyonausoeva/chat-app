import { ChangeEvent, FormEvent } from 'react';

export type OnFormChange = (e: ChangeEvent<HTMLInputElement>) => void;
export type OnFormSubmit = (e: FormEvent<HTMLFormElement>) => void;

export type JsonRpcRequest = {
  jsonrpc: '2.0';
  method: string;
  params?: any;
  id: number | string;
};

export type JsonRpcResponse<T> = {
  jsonrpc: '2.0';
  result?: T;
  error?: { code: number; message: string };
  id: number | string;
};

export type JsonRpcSuccess<T> = {
  jsonrpc: '2.0';
  result: T;
  id: number | string;
};

export type JsonRpcError = {
  jsonrpc: '2.0';
  error: { code: number; message: string; data?: any };
  id: number | string | null;
};
