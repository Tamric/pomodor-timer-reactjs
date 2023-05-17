import timeSlice from './slices/timeSlice'
import timerSlice from './slices/timerSlice';
import animationSlice from './slices/animationSlice';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

const reducer = combineReducers({
	time: timeSlice,
	timer: timerSlice,
	animation: animationSlice,
})


const store = configureStore({
  reducer: reducer,
});

export default store;
