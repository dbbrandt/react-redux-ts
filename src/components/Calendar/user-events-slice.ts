import {createSlice, PayloadAction, SerializedError} from '@reduxjs/toolkit';
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

export const createEvent = createAsyncThunk(
    'userEvents/createEvent',
    async (event : InitialEvent, { rejectWithValue}) => {
      try {
        const response = await fetch(`http://localhost:3001/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        });
        if (!response.ok) {
          return rejectWithValue('Network response was not ok');
        }
        const createdEvent: UserEvent = await response.json();
        return createdEvent;
      } catch (error) {
        return rejectWithValue('Failed to create event');
      }
    }
)

export interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

export interface InitialEvent extends Omit<UserEvent, "id"> {}

export const initialEvent : Omit<InitialEvent,"id"> = {
  title: "",
  dateStart: "",
  dateEnd: ""
};


export interface UserEventsState {
  byIds: Record<UserEvent['id'], UserEvent>;
  allIds: UserEvent['id'][];
  loading: boolean;
  error: string | null | SerializedError;
}

const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
  loading: false,
  error: null
};

const setError = (
    state: UserEventsState,
    action: PayloadAction<unknown, string, unknown, SerializedError>
) => {
  state.loading = false;
  state.error = action.error?.message ?? 'An unknown error occurred';
};

const userEventsSlice = createSlice({
  name: 'userEvents',
  initialState,
  reducers: {
    // Define your reducers here. Each key in this object will be an action creator.
    // For example:
    // addUserEvent(state, action: PayloadAction<UserEvent>) {
    //   const event = action.payload;
    //   state.byIds[event.id] = event;
    //   state.allIds.push(event.id);
    // }
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
        .addCase(createEvent.fulfilled, (state,  action) => {
          const event = action.payload;
          state.byIds[event.id] = event;
          state.allIds.push(event.id);
        })
        .addCase(loadEvents.rejected, setError)
        .addCase(createEvent.rejected, setError);
  }
});

// Export the action creators
// export const { addUserEvent } = userEventsSlice.actions;

export default userEventsSlice.reducer;