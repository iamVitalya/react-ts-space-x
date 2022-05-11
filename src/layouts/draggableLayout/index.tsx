import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import { DraggableContext, IDraggableColumn } from './draggableContext'
import clsx from 'clsx'

export const DraggableLayout: React.FC<{ children: React.ReactNode | JSX.Element | JSX.Element[] }> = ({ children }) => {
	const [columns, setColumns] = useState<IDraggableColumn[]>([])
	const [clone, setClone] = useState<ReactElement | null>(null)
	const [coordinates, setCoordinates] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
	const [rotateClone, setRotateClone] = useState<boolean>(false)

	const setDrop = (index: number, drop: boolean) => {
		setColumns(prev => {
			return [
				...prev.slice(0, index),
				{
					...prev[index],
					drop,
				},
				...prev.slice(index + 1),
			]
		})
	}

	useEffect(() => {
		let isMounting = true
		setTimeout(() => {
			if (isMounting && clone) setRotateClone(true)
		}, 100)

		if (!clone && rotateClone) setRotateClone(false)

		return () => {
			isMounting = false
		}
	}, [clone, rotateClone])


	const draggableContext = useContext(DraggableContext)
	useEffect(() => {
		return () => {
			draggableContext.setColumns([])
		}
	}, [draggableContext])


	const modifyChildren = (child: ReactElement | ReactNode) => {
		if (!React.isValidElement(child) || !child) return null
		return React.cloneElement(
			child,
			{
				className: clsx(
					child.props.className,
					{ rotate: rotateClone }
				),
				style: {
					...child.props.style,
					left: coordinates.x,
					top: coordinates.y,
				},
			}
		)
	}

	return (
		<DraggableContext.Provider value={{ columns, setColumns, setDrop, clone, setClone, coordinates, setCoordinates }}>
			{children}
			{React.Children.map<ReactElement | null, ReactElement | ReactNode>(clone, child => modifyChildren(child))}
		</DraggableContext.Provider>
	)
}
