import {Clock} from './components/Clock'
import {Timer} from './components/Timer'

function Pomodoro() {
  return (
    <div id="pomodoro">
	  <Clock /> 
	  <Timer />
	</div>
  );
}

export default Pomodoro;
