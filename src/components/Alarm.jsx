import {useDispatch, useSelector} from "react-redux"
import { alarmOff } from "../store/slices/timerSlice.js"
import { useEffect, useRef} from 'react';

import WARNING_SOUND from './assets/sound/bell.oga';
import ALARM_SOUND from './assets/sound/complete.oga';


//store audio as hook
const useAudio = (src, endListener) =>{
	const audio = useRef(new Audio(src));

	audio.current.addEventListener('ended', endListener);
	return audio.current
}

const Alarm = props =>{
	const timer = useSelector(state => state.timer);
	const dispatch = useDispatch()
	const end = ()=>{
		dispatch(alarmOff())
	}
 	const warn = useAudio(WARNING_SOUND, end)
	const alarm = useAudio(ALARM_SOUND, end);

	useEffect(()=>{
		switch(timer.alarm){
			case 'warn':
				warn.play();
				break;
			case 'alarm':
				alarm.play();
                break;
            default:
		}
	}, [timer.alarm])

	return <></>
}

export default Alarm;
