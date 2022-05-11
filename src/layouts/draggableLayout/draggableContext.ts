import { createContext, Dispatch, ReactElement, SetStateAction } from 'react'

export interface IDraggableColumn {
	element: HTMLDivElement
	drop: boolean
	type: string
}

interface IDraggableContext {
	columns: IDraggableColumn[]
	setColumns: Dispatch<SetStateAction<any>>
	setDrop: (index: number, drop: boolean) => void
	clone: ReactElement | null
	setClone: Dispatch<SetStateAction<any>>
	coordinates: { x: number, y: number }
	setCoordinates: Dispatch<SetStateAction<any>>
}

export const DraggableContext = createContext<IDraggableContext>({
	columns: [],
	setColumns: () => {},
	setDrop: () => {},
	clone: null,
	setClone: () => {},
	coordinates: { x: 0, y: 0 },
	setCoordinates: () => {},
})
