import React from 'react'
import styles from './Scroll.module.scss'

export const Scroll: React.FC<{ children: React.ReactNode | JSX.Element | JSX.Element[] }> = ({ children }) => (
	<div className={styles.scroll}>
		{children}
	</div>
)
