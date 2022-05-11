import React from 'react'
import { Title } from '../components/title'
import { SpeakerColumn } from '../components/speakerColumn'
import { DraggableLayout } from '../layouts/draggableLayout'

export const Home: React.FC = () => (
	<DraggableLayout>
		<Title title={'Explore the space 🌎'}/>
		<SpeakerColumn/>
	</DraggableLayout>
)
