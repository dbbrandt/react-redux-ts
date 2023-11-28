import { configureStore, Middleware } from '@reduxjs/toolkit';
import userEventsReducer from './user-events';

let middleware: Middleware[] = [];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middleware.push(logger);
}

const store = configureStore({
  reducer: {
    userEvents: userEventsReducer
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),

});

// Type for the RootState based on the rootReducer
export type RootState = ReturnType<typeof store.getState>;

export default store;
