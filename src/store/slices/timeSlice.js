import { createSlice } from "@reduxjs/toolkit"

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

export const { setTime,  toggleAMPM, toggleSeconds , toggleShow} = timeSlice.actions
export default timeSlice.reducer;
