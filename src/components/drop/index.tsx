import React, { ReactElement, ReactNode, useCallback, useContext } from 'react'
import clsx from 'clsx'
import { DraggableContext } from '../../layouts/draggableLayout/draggableContext'
import { ScheduleColumnEnum } from '../../redux/slices/launchesSlice'

interface DropProps {
	children: React.ReactNode | JSX.Element | JSX.Element[]
	type: ScheduleColumnEnum
}

export const Drop: React.FC<DropProps> = ({ children, type }) => {
	const draggableContext = useContext(DraggableContext)

	const handleRef = useCallback((node: HTMLDivElement) => {
		if(!node) return

		if (node && !draggableContext.columns.map(column => column.element).includes(node)) {
			draggableContext.setColumns([
				...draggableContext.columns,
				{
					element: node,
					drop: false,
					type,
				},
			])
		}
		return () => {
			draggableContext.setColumns([])
		}
	}, [draggableContext, type])

	const modifyChildren = (child: ReactElement | ReactNode) => {
		if (!React.isValidElement(child) || !child) return null

		return React.cloneElement(
			child,
			{
				ref: handleRef,
				className: clsx(
					child.props.className,
					{ drop: draggableContext.columns.filter(column => column.type === type)?.[0]?.drop }
				),
			}
		)
	}

	return (
		<>
			{React.Children.map<ReactElement | null, ReactElement | ReactNode>(children, child => modifyChildren(child))}
		</>
	)
}
