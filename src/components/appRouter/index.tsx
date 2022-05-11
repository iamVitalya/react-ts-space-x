import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from '../../pages/home'
import { Launch } from '../../pages/launch'
import Layout from '../../layouts'

export const AppRouter: React.FC = () => (
	<Routes>
		<Route path="/" element={<Layout />}>
			<Route index element={<Home/>}/>
			<Route path="/launch/:id" element={<Launch/>}/>
		</Route>
	</Routes>
)
