import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Avatar, Col, Row, message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styles from './LaunchCard.module.scss'
import { ILaunch, launchesActions, ScheduleColumnEnum } from '../../redux/slices/launchesSlice'
import { DateClass } from '../../classes/dateClass'
import { Drag } from '../drag'
import { useAppDispatch } from '../../redux/configureStore'
import { spacexApi } from '../../api/spacexApi'
import { reservedLaunchesActions } from '../../redux/slices/reservedLaunchesSlice'

interface LaunchCardProps {
	launch: ILaunch
	column: ScheduleColumnEnum
}

export const LaunchCard: React.FC<LaunchCardProps> = ({ launch, column }) => {
	const dispatch = useAppDispatch()
	const [modalVisible, setModalVisible] = useState(false)

	const confirm = (onOk?: () => void) => {
		Modal.confirm({
			title: 'Отменить бронирование?',
			icon: <ExclamationCircleOutlined />,
			visible: modalVisible,
			okText: 'Да, отменить',
			cancelText: 'Нет',
			onOk,
		})
	}

	const onDragEnd = (type: string) => {
		if (type === column) return
		const moveAction = launchesActions.moveLaunch({ id: launch.id, inColumn: column, outColumn: type as ScheduleColumnEnum })
		if (type === ScheduleColumnEnum.Future) {
			confirm(() => {
				dispatch(moveAction)
				setModalVisible(false)
				dispatch(spacexApi.endpoints.reserveCancelLaunch.initiate(launch.id))
				dispatch(reservedLaunchesActions.removeLaunch(launch.id))
				const loadingMessage = 'Отмена бронирования'
				const responseMessage = 'Бронирование отменено'
				message.loading(loadingMessage, 0.8)
					.then(() => {
						setTimeout(() => message.success(responseMessage, 1.5), 300)
					})
			})
		}
		else {
			dispatch(moveAction)
			dispatch(spacexApi.endpoints.reserveLaunch.initiate(launch.id))
			dispatch(reservedLaunchesActions.addLaunch(launch.id))
			const loadingMessage = 'Бронирование полета'
			const responseMessage = 'Вы успешно забронировали полет'
			message.loading(loadingMessage, 0.8)
				.then(() => {
					setTimeout(() => message.success(responseMessage, 1.5), 300)
				})
		}
	}

	const navigate = useNavigate()

	return (
		<Drag
			onDragEnd={onDragEnd}
			disabled={column === ScheduleColumnEnum.Past}
			currentColumn={column}
			onClick={() => navigate(`/launch/${launch.id}`)}
		>
			<div className={clsx(styles['launch-card'])}>
				<Link to={`/launch/${launch.id}`}>
					<Row>
						<Col className={styles['launch-card__left']}>
							<Avatar icon={<img src={launch.links.patch.small ?? launch.rocket.flickr_images?.[0]} alt=""/>}/>
						</Col>
						<Col>
							<h4>{launch.name}</h4>
							<p className={styles['launch-card__rocket']}>{launch.rocket.name}</p>
							<p className={styles['launch-card__date']}>{DateClass.dateToFormat(launch.date_unix, false)}</p>
						</Col>
					</Row>
				</Link>
			</div>
		</Drag>
	)
}
