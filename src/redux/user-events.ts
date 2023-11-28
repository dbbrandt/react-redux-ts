import { createReducer } from '@reduxjs/toolkit';

interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

export interface UserEventsState {
  byIds: Record<UserEvent['id'], UserEvent>;
  allIds: UserEvent['id'][];
}

const initialState: UserEventsState = {
  byIds: {},
  allIds: []
};

const userEventsReducer = createReducer(initialState, builder => {
  // Here you can handle different actions
  // For example:
  // builder.addCase(yourAction, (state, action) => {
  //   // Mutate the state directly, it's safe within createReducer
  // });
  // If you have no cases yet, you can leave it empty
});

export default userEventsReducer;