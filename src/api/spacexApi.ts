import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { ILaunch, launchesActions } from '../redux/slices/launchesSlice'
import { message } from 'antd'

interface ListResponse<T> {
	docs: T[]
	totalDocs: number
	offset: number
	limit: number
	totalPages: number
	page: number
	pagingCounter: number
	hasPrevPage: boolean
	hasNextPage: boolean
	prevPage: number
	nextPage: number
}

interface ICrew {
	crew: {
		id: string
		image: string
		name: string
		wikipedia: string
	}
	role: string
}

interface ILaunchDetail {
	id: string
	name: string
	details: string
	date_unix: number
	crew: ICrew[]
	links: {
		article: string
		patch: {
			small: string
		}
		webcast: string
		wikipedia: string
	}
	rocket: {
		id: string
		name: string
		description: string
		diameter: {
			meters: number
		}
		height: {
			meters: number
		}
		mass: {
			kg: number
		}
		flickr_images: string[]
		wikipedia: string
	}
}


const isRequest = (input: RequestInfo): input is Request => {
	return input instanceof Request
}

const fetchFn = async (input: RequestInfo): Promise<any> => {
	if (!isRequest(input)) return
	return input.url.includes('launches/reservation') ? new Response('ok', { status: 200 }) : fetch(input)
}

export const spacexApi = createApi({
	reducerPath: 'spacexApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://api.spacexdata.com/v5/', fetchFn }),
	tagTypes: ['launches', 'launchInfo'],
	keepUnusedDataFor: 3600,
	endpoints: (builder) => ({
		getLaunches: builder.query<ListResponse<ILaunch>, | number>({
			query: (page = 1) => ({
				url: 'launches/query',
				method: 'POST',
				body: {
					options: {
						select: ['name', 'date_unix', 'links.patch.small'],
						sort: {
							date_unix: -1,
						},
						limit: 70,
						populate: {
							path: 'rocket',
							select: {
								name: 1,
								flickr_images: { $slice: 1 },
							},
						},
					},
					page,
				},
			}),
			async onQueryStarted(query, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					dispatch(launchesActions.setLaunches(data.docs))
				}
				catch (err) {
					message.error('Ошибка загрузки полетов')
				}
			},
			providesTags: ['launches'],
		}),
		getLaunchById: builder.query<ListResponse<ILaunchDetail>, | string>({
			query: (id: string) => ({
				url: 'launches/query',
				method: 'POST',
				body: {
					query: { _id: id },
					options: {
						select: ['name', 'date_unix', 'links.patch.small', 'links.webcast', 'links.article', 'links.wikipedia', 'details', 'crew'],
						populate: [
							{
								path: 'rocket',
								select: ['name', 'flickr_images', 'height.meters', 'diameter.meters', 'mass.kg', 'wikipedia', 'description'],
							},
							{
								path: 'crew.crew',
								select: ['name', 'image', 'wikipedia'],
							},
						],
					},
				},
			}),
			providesTags: ['launchInfo'],
		}),
		reserveLaunch: builder.query<ListResponse<ILaunch>, | string>({
			query: (id: string) => ({
				url: 'launches/reservation',
				method: 'POST',
				body: { id },
			}),
		}),
		reserveCancelLaunch: builder.query<ListResponse<ILaunch>, | string>({
			query: (id: string) => ({
				url: 'launches/reservation/cancel',
				method: 'POST',
				body: { id },
			}),
		}),
	}),
})
