//***************************************************************************************************************************************************************************************
//Imports
//***************************************************************************************************************************************************************************************
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector} from 'react-redux';
import './index.css';
import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';

//Will need to change this 

import pauseIMG from './assets/pause.svg'
import stopIMG from './assets/stop.svg'
import playIMG from './assets/play2.svg'
import arrowIMG from './assets/arrow.svg'
import resetIMG from './assets/reset.svg'
//***************************************************************************************************************************************************************************************
//Constant Variables and Private Helper functions
//***************************************************************************************************************************************************************************************

const MAX_TIME = 57600;

const _toggleWorkRest = _ => _==='work'?'rest':'work';
//Pads Numbers to have length equal to padding, default 2
const pad = (number, padding=2)=>padding>String(number).length?'0'.repeat(padding-String(number).length)+number:number;
//container to place app within
const container = document.getElementById('root');
//helper for time formatting, coverts seconds to min and seconds
const _minSec =n =>{
		const sec = n %60;
		const min = (n - sec)/60;
		return (min>0?min+' m':'')+(sec>0?sec+' s':' ')
} 
//allows placement on the page
const root = createRoot(container);

//***************************************************************************************************************************************************************************************
//RTK Slices
//***************************************************************************************************************************************************************************************
//Timer Slice for Timers Component

const timerInitState = {
	currentTime: 0,
	work: 1500, //time stored in seconds
	rest: 300,
	sound: true,
	status: 'idle',
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
					//write alarm big beep here
				}
				else if(state.currentTime>(state[state.currentPeriod]-30) && state[state.currentPeriod]%5===0)
				{
					//write alarm small beep here
				}
			}
			else{	
				state.currentTime=0;
				state.currentPeriod = _toggleWorkRest(state.currentPeriod); 
			}	
		},
		toggleWorkRest: state=>{
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
			if(state[state.currentPeriod]===0)state[state.currentPeriod]=0;
		},
		reset: state=> {
			return {
			currentTime: 0,
			rest: state.rest,
			currentPeriod: state.currentPeriod,
			work: state.work,
			sound: state.sound,
			status: 'idle',
		}},
		fullReset: ()=> timerInitState,
		toggleSound: state =>{ state.sound = !state.sound },
	}
})

const {start,run, pause, stop,toggleWorkRest, setDuration, increasePeriod, 
	decreasePeriod, reset, fullReset, toggleAlert, toggleSound}= timerSlice.actions;

//***************************************************************************************************************************************************************************************
//Time Slice for Clock Component

const timeInitState = {
	hours: (new Date).getHours(),
	min: (new Date).getMinutes(),
	seconds: (new Date).getSeconds(),
	showSeconds: false,
	showAMPM: true,
	show: true,
}

const timeSlice = createSlice({
	name: 'time',
	initialState: timeInitState,
	reducers: {
		setTime: (state, action) => ({
			hours: action.payload.hours,
			min: action.payload.min,
			seconds: action.payload.seconds,
			showAMPM: state.showAMPM,
			showSeconds: state.showSeconds,
			show: state.show,
		}),
		toggleAMPM: state => {state.showAMPM = !state.showAMPM},
		toggleSeconds: state => {state.showSeconds = !state.showSeconds},
		toggleShow: state=> {state.show = !state.show},
	},
})

const { setTime,  toggleAMPM, toggleSeconds , toggleShow} = timeSlice.actions

//***************************************************************************************************************************************************************************************
//Store
//***************************************************************************************************************************************************************************************

const reducer = combineReducers({
	time: timeSlice.reducer,
	timer: timerSlice.reducer,
})

const store = configureStore({
  reducer: reducer,
});
//***************************************************************************************************************************************************************************************

//***************************************************************************************************************************************************************************************

/**
 * Clock Component
 * Holds all parts for Clock GUI
 */
const Clock = props =>{
	const dispatch = useDispatch();
	const time = useSelector(state => state.time);
	const pmAm = time && time.hours>11?'pm':'am';
	const handleAMPM = ()=>dispatch(toggleAMPM());
	const handleSeconds = ()=>dispatch(toggleSeconds());
	const handleShow = ()=>dispatch(toggleShow());

	const getTime = ()=>{
			const date = new Date();
			const hours = date.getHours();
			const min =date.getMinutes();
			const seconds = date.getSeconds();
		dispatch(setTime({hours: hours, min: min, seconds: seconds}));
		}

	React.useEffect(()=>{
		setInterval(getTime, 1000)
	},[])

	return (time.show?
		<div id='clock'>
			<p id='time' className='clickable' onClick={handleShow}>{time.showAMPM===false?time.hours:time.hours===0?12:time.hours>12?time.hours-12:time.hours}:{pad(time.min)}{(time.showSeconds && "."+pad(time.seconds))} {(time.showAMPM && pmAm)}</p>
			<div className='clockLabels'>
				<p className={'clickable clockLabel '+(time.showAMPM?'selected':'')} onClick={handleAMPM}>24-H
				</p>
				<p className={'clickable clockLabel '+(time.showSeconds?'selected':'')} onClick={handleSeconds}>Seconds
				</p>
			</div>
		</div>:<p className='center clickable finePrint' onClick={handleShow}>Show Clock</p>
	)
}
	

const PlayAndPause = props=>{
	const timer = useSelector(state => state.timer);
	return (timer.status==='running') ? <img id='pause' onClick={props.onClickPause} draggable='false' className='icon' src={pauseIMG} alt="Pause Icon"/>
		: <img id='play' onClick={props.onClickPlay} draggable='false' className='icon' src={playIMG} alt="Play Icon"/>
}

const TimeContainer=()=>
	{
	const timer = useSelector(state=>state.timer);
	return (timer.status==='idle')?
				<p className='timerDisp'>{timer.currentPeriod==='work'?_minSec(timer.work):_minSec(timer.rest)}</p>
		:
			<p className='timerDisp'>{_minSec(timer.currentTime)}</p>
	}


const StopAndReset = props=>{
	const timer = useSelector(state=>state.timer);
	return (timer.status==='running')? <img id="stop" onClick={props.onClickStop} draggable='false' className='icon' src={stopIMG} alt="Stop Icon"/>:
			<img id="reset" onClick={props.onClickReset} draggable='false' className='icon' src={resetIMG} alt="Reset Icon"/>
}
/**
 * Sound ON/OFF button
 */
const SoundON = props=>{
	const timer = useSelector(state=>state.timer);
	return	timer.sound?(<p className="finePrint clickable" onClick={props.onClick}>Sound On</p>):(<p className="finePrint clickable" onClick={props.onClick}>Sound Off</p>)
}

/**
 * Timer Component
 * Holds all the GUI for timer interactions
 */
const Timers = props =>{
	const dispatch = useDispatch();
	const timer = useSelector(state => state.timer);

	console.log('draw timers')
	console.log('status:', timer.status)
	const timeRef = React.useRef(null)

	const tLfunc = useCallback(()=>{
		const promise = new Promise(resolve=>{
			timeRef.current=setTimeout(resolve,1000)
		});
		
		promise.then(p=>{
			if(timer.status==='idle'){
				clearTimeout(timeRef.current)
				timeRef.current = undefined;
				return
	 		}
			if(timer.status === 'running'){
				dispatch(run());
			}
		});
	},[timer.status])


	React.useEffect(()=>{
		tLfunc()
	},[timeRef.current])

	const onClickPlay = useCallback(()=>{
		dispatch(start());
		if(!timeRef.current)tLfunc();
	},[timeRef.current])

	const onClickPause =useCallback(()=>{
		dispatch(pause());
		clearTimeout(timeRef.current);
	}, [timeRef.current])

	return	<div id="timers">
		<div className="row tight" onClick={()=>dispatch(toggleWorkRest())}>
			<p className={"clickable "+(timer.currentPeriod==='rest'?'selected':'')}>Rest</p>
			<p className={"clickable "+(timer.currentPeriod==='work'?'selected':'')}>Work</p>
		</div>
		<div id='timer' >
			<img id="up" onClick={()=>dispatch(increasePeriod())} className='icon' src={arrowIMG} draggable='false' alt="Up Arrow Icon"/>
			<div className="row tight">
				<PlayAndPause onClickPlay={onClickPlay} onClickPause={onClickPause}/> 
				<TimeContainer/>
				<StopAndReset/>
			</div>
		<img id="down" onClick={()=>dispatch(decreasePeriod())} className='icon' draggable='false' src={arrowIMG} alt="Down Arrow Icon"/>
		</div>
		<div className="row tight">
			<p className="finePrint clickable" onClick={()=>dispatch(fullReset())} >Reset All</p>
			<SoundON onClick={()=>dispatch(toggleSound())}/>
		</div>
	</div>	
}

function Pomodoro() {
  return (
    <div id="pomodoro">
	  <Clock /> 
	  <Timers />
	</div>
  );
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Pomodoro />
    </Provider>
  </React.StrictMode>
);

