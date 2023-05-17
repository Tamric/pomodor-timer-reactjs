import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setTime, toggleAMPM, toggleSeconds, toggleShow } from '../store/slices/timeSlice'

//Pads Numbers to have length equal to padding, default 2
const pad = (number, padding=2)=>padding>String(number).length?'0'.repeat(padding-String(number).length)+number:number;
/**
 * Clock Component
 * Holds all parts for Clock GUI
 */
export const Clock = props =>{
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

	useEffect(()=>{
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

