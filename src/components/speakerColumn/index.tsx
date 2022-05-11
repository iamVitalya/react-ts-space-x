import React from 'react'
import { Row } from 'antd'
import styles from './SpeakerColumn.module.scss'
import { SpeakerColumnItem } from './item/SpeakerColumnItem'
import { ScheduleColumnEnum } from '../../redux/slices/launchesSlice'
import { spacexApi } from '../../api/spacexApi'
import { Drop } from '../drop'

export const SpeakerColumn = () => {
	const { isFetching } = spacexApi.useGetLaunchesQuery(1)

	return (
		<Row className={styles.schedule}>
			<SpeakerColumnItem
				title={'Past Launches'.toUpperCase()}
				column={ScheduleColumnEnum.Past}
				isFetching={isFetching}
				noDataText="Прошедших запусков нет"
			/>
			<Drop type={ScheduleColumnEnum.Future}>
				<SpeakerColumnItem
					title={'Launches'.toUpperCase()}
					column={ScheduleColumnEnum.Future}
					isFetching={isFetching}
					noDataText="Предстоящих запусков нет"
				/>
			</Drop>
			<Drop type={ScheduleColumnEnum.Reserved}>
				<SpeakerColumnItem
					title={'My Launches'.toUpperCase()}
					column={ScheduleColumnEnum.Reserved}
					isFetching={isFetching}
					noDataText="Переместите карточку в эту колонку, чтобы&nbsp;забронировать запуск"
				/>
			</Drop>
		</Row>
	)
}
