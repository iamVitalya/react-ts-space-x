import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: string[] = []

export const reservedLaunchesSlice = createSlice({
	name: 'reservedLaunches',
	initialState,
	reducers: {
		addLaunch: (state, action: PayloadAction<string>) => {
			state.push(action.payload)
		},
		removeLaunch: (state, action: PayloadAction<string>) => {
			return state.filter(item => item !== action.payload)
		},
	},
})

export const reservedLaunchesActions = reservedLaunchesSlice.actions
export const reservedLaunchesReducer =  reservedLaunchesSlice.reducer
