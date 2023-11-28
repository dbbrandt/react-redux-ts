import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const userEventsSlice = createSlice({
  name: 'userEvents',
  initialState,
  reducers: {
    // Define your reducers here. Each key in this object will be an action creator.
    // For example:
    addUserEvent(state, action: PayloadAction<UserEvent>) {
      const event = action.payload;
      state.byIds[event.id] = event;
      state.allIds.push(event.id);
    }
    // You can add as many reducers as you need.
  }
});

// Export the action creators
export const { addUserEvent/* export your action creators here, e.g., addUserEvent */ } = userEventsSlice.actions;

export default userEventsSlice.reducer;