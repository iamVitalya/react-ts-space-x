import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DateClass } from '../../classes/dateClass'
import { groupBy, sortBy, reverse, findIndex } from 'lodash'

export enum ScheduleColumnEnum {
	Past = 'past',
	Future = 'future',
	Reserved = 'reserved',
}

interface IRocket {
	id: string
	name: string
	flickr_images: string[]
}

export interface ILaunch {
	id: string
	name: string
	date_unix: number
	links: {
		patch: {
			small: string
		}
	}
	rocket: IRocket
}

type LaunchesState = {
	[key in ScheduleColumnEnum]: ILaunch[]
}

const initialState: LaunchesState = {
	[ScheduleColumnEnum.Past]: [],
	[ScheduleColumnEnum.Future]: [],
	[ScheduleColumnEnum.Reserved]: [],
}

export const launchesSlice = createSlice({
	name: 'launches',
	initialState,
	reducers: {
		setLaunches: (state, action: PayloadAction<ILaunch[]>) => {
			const timestampNow = DateClass.unixNow()
			const launchesByDate = groupBy(
				action.payload,
				launch => {
					return launch.date_unix < timestampNow
						? ScheduleColumnEnum.Past
						: ScheduleColumnEnum.Future
				}
			)

			const persist = localStorage.getItem('persist:spacex')
			let reservedLaunches: string[] = []
			if (persist) {
				reservedLaunches = JSON.parse(JSON.parse(persist).reservedLaunches)
			}

			const launchesByReserved = groupBy(
				launchesByDate[ScheduleColumnEnum.Future],
				launch => {
					return reservedLaunches.includes(launch.id)
						? ScheduleColumnEnum.Reserved
						: ScheduleColumnEnum.Future
				}
			)
			const launchesGroup = {
				[ScheduleColumnEnum.Past]: launchesByDate[ScheduleColumnEnum.Past],
				[ScheduleColumnEnum.Future]: launchesByReserved[ScheduleColumnEnum.Future],
				[ScheduleColumnEnum.Reserved]: launchesByReserved[ScheduleColumnEnum.Reserved],
			}

			state[ScheduleColumnEnum.Past] = reverse(sortBy(launchesGroup[ScheduleColumnEnum.Past], ['date_unix']))
			state[ScheduleColumnEnum.Future] = sortBy(launchesGroup[ScheduleColumnEnum.Future], ['date_unix'])
			state[ScheduleColumnEnum.Reserved] = sortBy(launchesGroup[ScheduleColumnEnum.Reserved], ['date_unix'])
		},

		moveLaunch: (state, action: PayloadAction<{ id: string, inColumn: ScheduleColumnEnum, outColumn: ScheduleColumnEnum }>) => {
			if (state[action.payload.outColumn].filter(launch => launch.id === action.payload.id).length) return
			const index = findIndex(state[action.payload.inColumn], ['id', action.payload.id])
			state[action.payload.outColumn] = sortBy([...state[action.payload.outColumn], state[action.payload.inColumn][index]], ['date_unix'])
			state[action.payload.inColumn].splice(index, 1)
		},
	},
})

export const launchesActions = launchesSlice.actions
export const launchesReducer = launchesSlice.reducer
