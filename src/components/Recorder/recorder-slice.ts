import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Action } from 'redux';
// import { RootState } from './store';

interface RecorderState {
    dateStart: string;
}

const initialState: RecorderState = {
    dateStart: ''
};

const recorderSlice = createSlice({
    name: 'recorderEvents',
    initialState,
    reducers: {
        // Define your reducers here. Each key in this object will be an action creator.
        // For example:
        // startRecording(state, action: PayloadAction<string>) {
        //     state.dateStart = action.payload;
        // },
        startRecording(state) {
            state.dateStart = new Date().toISOString();
        },
        stopRecording(state) {
            state.dateStart = '';
        }
        // You can add as many reducers as you need.
    }
});

// Export the action creators
export const { startRecording, stopRecording } = recorderSlice.actions;

export default recorderSlice.reducer;