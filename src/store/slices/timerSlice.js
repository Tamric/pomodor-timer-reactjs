import { createSlice } from "@reduxjs/toolkit";

const MAX_TIME = 57600; //time in seconds
const _toggleWorkRest = _ => _==='work'?'rest':'work';

const timerInitState = {
	currentTime: 0,
	work: 1500, //time stored in seconds 1500 sec = 25 min
	rest: 300,
	sound: true,
	status: 'idle',
	alarm: 'none',
	currentPeriod: 'work',
}

const timerSlice = createSlice({
	name: 'timer',
	initialState: timerInitState,
	reducers: {
		start: state=>{
			state.status='running';
		},
		run: state =>{
			if(state.currentTime!=state[state.currentPeriod]){
				state.currentTime+=1;
				if(state.currentTime===state[state.currentPeriod]){
					state.alarm='alarm';
				}
				else if(state.currentTime>=(state[state.currentPeriod]-30) && state.currentTime%10===0)
				{
					state.alarm='warn'
				}
			}
			else{	
				state.currentTime=0;
				state.currentPeriod = _toggleWorkRest(state.currentPeriod); 
			}	
		},
		alarmOff: state=>{
			state.alarm='none';
		},
		toggleWorkRest: state=>{
			state.currentTime = 0;
			state.currentPeriod = _toggleWorkRest(state.currentPeriod)
		},
		pause: state=>{
			state.status = 'paused';
		},
		stop: state=>{
			state.currentTime = 0;
			state.status = 'idle';
		},
		setDuration: (state, action) => {
			const _state = action.payload.state;
			if(_state!='work' || _state!='rest') throw new TypeError('Object.state should equal work or rest only');
			state[_state]= action.payload.amount*60},
		increasePeriod: state=>{
			state[state.currentPeriod]+=60;
			if(state[state.currentPeriod]===MAX_TIME) state[state.currentPeriod] = MAX_TIME;
		},
		decreasePeriod: state=>{
			state[state.currentPeriod]-=60;
			if(state[state.currentPeriod]<60)state[state.currentPeriod]=60;
		},
		reset: state=> {
			return {
			currentTime: 0,
			rest: state.rest,
			currentPeriod: state.currentPeriod,
			work: state.work,
			sound: state.sound,
			alarm: state.alarm,
			status: 'idle',
		}},
		fullReset: ()=> timerInitState,
		toggleSound: state =>{ state.sound = !state.sound },
	}
})

export const {start,run, pause, stop,toggleWorkRest, setDuration, increasePeriod, 
	decreasePeriod, reset, fullReset, alarmOff, toggleAlert, toggleSound}= timerSlice.actions;
export default timerSlice.reducer;
