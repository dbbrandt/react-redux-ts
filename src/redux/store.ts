import { configureStore, Middleware } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import userEventsReducer from '../components/Calendar/user-events-slice';
import recorderSlice from "../components/Recorder/recorder-slice";

const middleware: Middleware[] = [];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middleware.push(logger);
}

const store = configureStore({
  reducer: {
    userEvents: userEventsReducer,
    recorderEvents: recorderSlice
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),

});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types

// Type for the RootState based on the rootReducer
export type RootState = ReturnType<typeof store.getState>;

export default store;
