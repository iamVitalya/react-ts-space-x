import React, { useState, useContext, ReactElement, ReactNode } from 'react'
import clsx from 'clsx'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { DraggableContext } from '../../layouts/draggableLayout/draggableContext'

interface DragProps {
	children: React.ReactNode | JSX.Element | JSX.Element[]
	onDragEnd?: (type: string) => void
	disabled?: boolean
	currentColumn?: string
	onClick?: () => any
}

export const Drag: React.FC<DragProps> = ({ children, onDragEnd, disabled, currentColumn, onClick }) => {
	const [isDragging, setIsDragging] = useState(false)
	const [startCoordinates, setStartCoordinates] = useState({ x: 0, y: 0 })
	const draggableContext = useContext(DraggableContext)

	const cloneComponent = (child: ReactElement | ReactNode, styles: any) => {
		if (!React.isValidElement(child) || !child) return null
		draggableContext.setClone(React.cloneElement(
			child,
			{
				className: clsx(
					child.props.className,
					'clone-drag'
				),
				style: {
					...styles,
					left: draggableContext.coordinates.x,
					top: draggableContext.coordinates.y,
				},
			}
		))
	}

	const isMouseEvent = (event: DraggableEvent): event is MouseEvent => {
		return event instanceof MouseEvent
	}

	const startHandler = (e: any, data: any) => {
		const dragCoordinates = {
			x: data.x + data.node.getBoundingClientRect().left,
			y: data.y + data.node.getBoundingClientRect().top,
		}
		draggableContext.setCoordinates(dragCoordinates)
		setStartCoordinates(dragCoordinates)

		const column: HTMLDivElement = draggableContext.columns.map(column => column.element)?.[0]
		const columnElement: HTMLDivElement = column.querySelector('.scroll') ?? column
		const padding = parseInt(window.getComputedStyle(columnElement).getPropertyValue('padding-right'))

		React.Children.map<ReactElement | null | undefined, ReactElement | ReactNode>(children, child => cloneComponent(child, {
			width: (column.offsetWidth - padding) + 'px',
		}))
	}

	const dragHandler = (event: DraggableEvent, data: DraggableData) => {
		setIsDragging(true)

		const dragCoordinates = {
			x: data.x + data.node.getBoundingClientRect().left,
			y: data.y + data.node.getBoundingClientRect().top,
		}
		draggableContext.setCoordinates(dragCoordinates)

		if (draggableContext.clone) {
			if (!isMouseEvent(event)) return

			draggableContext.columns.map(column => column.element).forEach((elem: Element, index: number) => {
				if (
					event.x >= elem.getBoundingClientRect().left
					&& event.x <= elem.getBoundingClientRect().left + elem.clientWidth
					&& event.y >= elem.getBoundingClientRect().top
					&& event.y <= elem.getBoundingClientRect().top + elem.clientHeight
				) {
					if (!draggableContext.columns[index].drop) draggableContext.setDrop(index, true)
				}
				else if (draggableContext.columns[index].drop) draggableContext.setDrop(index, false)
			})
		}
	}

	const stopHandler = (event: DraggableEvent, data: DraggableData): void | false => {
		const dragCoordinates = {
			x: data.x + data.node.getBoundingClientRect().left,
			y: data.y + data.node.getBoundingClientRect().top,
		}
		const isClicked = onClick && Math.abs(startCoordinates.x - dragCoordinates.x) < 3 && Math.abs(startCoordinates.y - dragCoordinates.y) < 3

		setIsDragging(false)
		if (draggableContext.clone) {
			draggableContext.setClone(null)

			let isMoving = false

			draggableContext.columns.map(column => column.element).forEach((elem: Element, index: number) => {
				if (draggableContext.columns[index].drop) {
					if (onDragEnd && !isClicked) onDragEnd(draggableContext.columns[index].type)
					draggableContext.setDrop(index, false)
					if (currentColumn !== draggableContext.columns[index].type) isMoving = true
				}
			})
			if (isMoving) return false
		}

		if (isClicked) {
			onClick()
			return false
		}
	}


	return (
		<>
			{children && (
				<Draggable
					onStart={startHandler}
					onDrag={dragHandler}
					onStop={stopHandler}
					position={{ x: 0, y: 0 }}
					disabled={disabled}
					defaultClassName={clsx({ dragging: isDragging })}
				>
					{children}
				</Draggable>
			)}
		</>
	)
}
