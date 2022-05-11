import React from 'react'
import { Carousel, Image } from 'antd'

interface GalleryProps {
	photos: string[]
}

export const Gallery: React.FC<GalleryProps> = ({ photos }) => (
	<Carousel autoplay>
		{photos.map(photo => (
			<div key={photo}>
				<Image
					src={photo}
				/>
			</div>
		))}
	</Carousel>
)
