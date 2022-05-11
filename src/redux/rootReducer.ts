import { combineReducers } from 'redux'
import { launchesReducer, launchesSlice } from './slices/launchesSlice'
import { reservedLaunchesReducer, reservedLaunchesSlice } from './slices/reservedLaunchesSlice'
import { spacexApi } from '../api/spacexApi'

export const { reducerPath, reducer } = spacexApi

const reducers = {
	[launchesSlice.name]: launchesReducer,
	[reservedLaunchesSlice.name]: reservedLaunchesReducer,
	[reducerPath]: reducer,
}

export const rootReducer = combineReducers(reducers)
