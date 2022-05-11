import React from 'react'
import styles from './Container.module.scss'

export const Container: React.FC<{ children: React.ReactNode | JSX.Element | JSX.Element[] }> = ({ children }) => (
	<div className={styles.container}>
		{ children }
	</div>
)
