import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from 'antd'
import { Header } from './components/header'
import { Content } from './components/content'
import { Logo } from './components/logo'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/configureStore'
import { AppRouter } from './components/appRouter'

export const App = () => (
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<BrowserRouter>
				<Layout>
					<Header>
						<Logo/>
					</Header>

					<Content>
						<AppRouter/>
					</Content>
				</Layout>
			</BrowserRouter>
		</PersistGate>
	</Provider>
)
