import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	posistion: {x: 0, y: 0},
	velocity: {x: 0, y: 0},
	value: 0,	
	collision: ()=>false,
}

const entitySlice = createSlice({
	name: 'entity',
	initialState,
	reducers: {
		new: (state, actions)=>{
			state = actions.payload;
		},
		setPos: (state, actions)=>{
			const [x,y] = actions.payload	
			state.posistion = {x,y};
		},
		move: (state, actions)=>{
			const [dt, velocity] = actions.payload;
			state.posistion = {
				x: state.posistion.x+(state.velocity.x*dt), 
				y: state.posistion.y+(state.velocity.y*dt),
			}
			state.velocity = velocity;
		},
		updateValue: (state, actions)=>{
			state.value = actions.payload;
		},
	},
})

export const {setPos, move, updateValue} = entitySlice.actions;
export default entitySlice.reducer
