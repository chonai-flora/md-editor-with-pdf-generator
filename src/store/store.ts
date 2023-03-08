import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { mdSlice, initialState as mdState } from '../states/state';

const preloadedState = () => {
  return mdState;
};

export const store = configureStore({
  reducer: mdSlice.reducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  preloadedState: preloadedState(),
  devTools: true,
});