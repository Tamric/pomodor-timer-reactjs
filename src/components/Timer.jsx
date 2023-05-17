import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';

import {run, start, pause, stop, toggleWorkRest, increasePeriod, decreasePeriod,reset, fullReset,  toggleSound} from '../store/slices/timerSlice'
import Alarm from './Alarm.jsx';

import pauseIMG from './assets/img/pause.svg';
import stopIMG from './assets/img/stop.svg';
import playIMG from './assets/img/play.svg';
import arrowIMG from './assets/img/arrow.svg';
import resetIMG from './assets/img/reset.svg';


//Timeout as hook
const useTimeout = callback=>{
	useEffect(()=>{
		const id = setTimeout(callback, 1000)
		return ()=>clearTimeout(id);
	})
}

//helper for time formatting, coverts seconds to min and seconds
const _minSec =n =>{
		const sec = n %60;
		const min = (n - sec)/60;
		return (min>0?min+' m':'')+(sec>0?sec+' s':' ')
} 

//Sub Component of Timer
//Holds Play and Pause
const PlayAndPause = props=>{
	const timer = useSelector(state => state.timer);
	return (timer.status==='running') ? <img id='pause' onClick={props.onClickPause} draggable='false' className='icon' src={pauseIMG} alt="Pause Icon"/>
		: <img id='play' onClick={props.onClickPlay} draggable='false' className='icon' src={playIMG} alt="Play Icon"/>
}

//Sub Component of Timer
//Displays time 
const TimeContainer=()=>
	{
	const timer = useSelector(state=>state.timer);
	return (timer.status==='idle')?
				<p className='timerDisp'>{timer.currentPeriod==='work'?_minSec(timer.work):_minSec(timer.rest)}</p>
		:
			<p className='timerDisp'>{_minSec(timer.currentTime)}</p>
	}

//Sub Component of Timer
//Holds Stop and Reset
const StopAndReset = props=>{
	return (props.status==='running')? <img id="stop" onClick={props.onClickStop} draggable='false' className='icon' src={stopIMG} alt="Stop Icon"/>:
			<img id="reset" onClick={props.onClickReset} draggable='false' className='icon' src={resetIMG} alt="Reset Icon"/>
}
/**
 * Sound ON/OFF button
 */
const SoundON = props=>{
	return	props.sound?(<p className="finePrint clickable" onClick={props.onClick}>Sound On</p>):(<p className="finePrint clickable" onClick={props.onClick}>Sound Off</p>)
}



/**
 * Timer Component
 * Holds all the GUI for timer interactions
 */
export const Timer = ()=>{
	const dispatch = useDispatch();
	const timer = useSelector(state => state.timer);

	const runFunc =  p=>{
			if(timer.status === 'running'){
				dispatch(run());
			}
		
	}

	useTimeout(runFunc);


	return	<div id="timers">
		<div className="row tight" onClick={()=>dispatch(toggleWorkRest())}>
			<p className={"clickable "+(timer.currentPeriod==='rest'?'selected':'')}>Rest</p>
			<p className={"clickable "+(timer.currentPeriod==='work'?'selected':'')}>Work</p>
		</div>
		<div id='timer' >
			<img id="up" onClick={()=>dispatch(increasePeriod())} className='icon' src={arrowIMG} draggable='false' alt="Up Arrow Icon"/>
			<div className="row tight">
				<PlayAndPause onClickPlay={()=>{dispatch(start());}} onClickPause={()=>{dispatch(pause());}}/> 
				<TimeContainer/>
				<StopAndReset status={timer.status} onClickReset={()=>dispatch(reset())} onClickStop={()=>dispatch(stop())}/>
			</div>
		<img id="down" onClick={()=>dispatch(decreasePeriod())} className='icon' draggable='false' src={arrowIMG} alt="Down Arrow Icon"/>
		</div>
		<div className="row tight">
			<p className="finePrint clickable" onClick={()=>dispatch(fullReset())} >Reset All</p>
			<SoundON sound={timer.sound} onClick={()=>dispatch(toggleSound())}/>
		</div>
		<Alarm/>
	</div>	
}
