import React from 'react'
import { PageHeader } from 'antd'
import styles from './Title.module.scss'

interface TitleProps {
	title: string
	onBack?: () => void
}

export const Title: React.FC<TitleProps> = ({ title, onBack }) => (
	<PageHeader
		title={title}
		className={styles.title}
		onBack={onBack}
	/>
)
