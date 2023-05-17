import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	entities: [],
}

const defaultEntity ={
	x: 0,
	y: 0,
	speed: 0,
	angle: 0,
	color: {r: 0, g: 0, b: 0, a:0},
	spin: 1,
	value: 0,
	size: 0,
	image: 'none' ,
}

const animationSlice=createSlice({
	name: 'animation',
	initialState,
	reducers : {
		newEntity: (state, actions)=>{ //adds addtional entities to scene, requires key, optional entity payload
			state.entities.push( Object.assign({},defaultEntity,actions.payload));
		},
		update: (state, actions)=>{ //update positions/motion
			

		}, 
		reImg: (state, actions)=>{//update img
			const [name, img] = actions.payload;
			if(!name || !img || !state.entities.hasOwnProperty(name)) return
			state.entities[actions.payload.name].img = img;
		},  
	},
})

export const {newEntity, update, reImg} = animationSlice.actions;
export default animationSlice.reducer;
