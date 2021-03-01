import { ThemeProvider } from '@material-ui/core';
import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { configureAppStore } from './store';
import { theme } from './theme';
import { AppUser, IApiClient, IAuthService } from './types';

const TestWrapper: FC<{ store: ReturnType<typeof configureAppStore> }> = ({
  children,
  store
}) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  );
};

export const configureTestWrapper = ({
  onAuthStateChangedResult,
  authOverrides,
  currentUserResult,
  signInWithEmailAndPasswordResult
}: {
  onAuthStateChangedResult?: AppUser | null;
  signInWithEmailAndPasswordResult?: AppUser | null;
  currentUserResult?: AppUser | null;
  authOverrides?: Partial<
    Pick<
      IAuthService,
      'onAuthStateChanged' | 'getCurrentUser' | 'signInWithEmailAndPassword'
    >
  >;
} = {}) => {
  const apiClientMock = new (jest.fn())() as IApiClient;

  const authService = new (jest.fn(() => {
    return {
      getCurrentUser: () => {
        if (currentUserResult !== undefined) return currentUserResult;
        return null;
      },
      signInWithEmailAndPassword: (email, password) => {
        if (signInWithEmailAndPasswordResult !== undefined) {
          return Promise.resolve(signInWithEmailAndPasswordResult);
        }

        return Promise.resolve(null);
      },
      onAuthStateChanged: (cb: (a: AppUser | null) => any) => {
        if (onAuthStateChangedResult !== undefined) {
          return cb(onAuthStateChangedResult);
        }

        return cb(null);
      },
      ...(authOverrides || {})
    } as IAuthService;
  }))();

  const store = configureAppStore(apiClientMock, authService);

  const WrapperWithStore: FC & { store: typeof store } = ({ children }) => {
    return <TestWrapper store={store}>{children}</TestWrapper>;
  };

  WrapperWithStore.store = store;

  return WrapperWithStore;
};
