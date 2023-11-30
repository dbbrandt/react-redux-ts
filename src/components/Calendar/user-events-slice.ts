import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadEvents = createAsyncThunk(
    'userEvents/loadEvents',
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch('http://localhost:3001/events');
        if (!response.ok) {
          return rejectWithValue('Network response was not ok');
        }
        const events : UserEvent[] = await response.json();
        return events;
      } catch (error) {
        return rejectWithValue('Failed to load events');
      }
    }
);

export interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

export interface UserEventsState {
  byIds: Record<UserEvent['id'], UserEvent>;
  allIds: UserEvent['id'][];
  loading: boolean;
  error: string | null;
}

const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
  loading: false,
  error: null
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
  },
  extraReducers: (builder) => {
    builder
        .addCase(loadEvents.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loadEvents.fulfilled, (state, action) => {
          action.payload.forEach((event: UserEvent) => {
            state.byIds[event.id] = event;
            if (!state.allIds.includes(event.id)) {
              state.allIds.push(event.id);
            }
          });
          state.loading = false;
        })
        .addCase(loadEvents.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
  }
});

// Export the action creators
export const { addUserEvent/* export your action creators here, e.g., addUserEvent */ } = userEventsSlice.actions;

export default userEventsSlice.reducer;