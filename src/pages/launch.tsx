import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Title } from '../components/title'
import { spacexApi } from '../api/spacexApi'
import { Gallery } from '../components/gallery'
import { Button, Col, Divider, Image, Result, Row, Skeleton, Statistic } from 'antd'
import { DateClass } from '../classes/dateClass'
import { UserOutlined } from '@ant-design/icons'

export const Launch: React.FC = () => {
	const params = useParams<{ id: string }>()
	const navigate = useNavigate()

	const { data, isError, isFetching } = spacexApi.useGetLaunchByIdQuery(String(params.id))

	if (isError) {
		return (
			<Result
				status="404"
				title="404"
				subTitle="Такая страница не найдена"
				extra={<Button type="primary" onClick={() => navigate('/')}>Вернуться на главную</Button>}
			/>
		)
	}

	const launch = data?.docs?.[0]

	return (
		<>
			{isFetching && (
				<>
					<Skeleton active={true} paragraph={{ rows: 0 }} />
					<Row>
						<Col span={16} style={{ paddingLeft: 60 }}>
							<Skeleton active={true} />
							<Skeleton active={true} />
						</Col>
						<Col span={8}>
							<Skeleton.Image style={{ width: 380, height: 300 }} />
						</Col>
					</Row>
				</>
			)}

			{launch && (
				<>
					<Title title={launch.name} onBack={() => navigate('/')}/>
					<Row>
						<Col span={16} style={{ paddingLeft: 60 }}>
							<h2>Дата запуска: {DateClass.dateToFormat(launch.date_unix, false)}</h2>

							{launch.details && (
								<>
									<Divider orientation="left">Описание</Divider>
									<p style={{ marginBottom: 40 }}>{launch.details}</p>
								</>
							)}

							<Divider orientation="left">Ракета {launch.rocket.name}</Divider>

							<Row>
								<Col span={8}>
									<Statistic title="Масса" value={`${launch.rocket.mass.kg} кг`}/>
								</Col>
								<Col span={8}>
									<Statistic title="Высота" value={`${launch.rocket.height.meters} м`}/>
								</Col>
								<Col span={8}>
									<Statistic title="Диаметр" value={`${launch.rocket.diameter.meters} м`}/>
								</Col>
								<p style={{ margin: '30px 0 10px' }}>{launch.rocket.description}</p>
								{launch.rocket.wikipedia && <p><a href={launch.rocket.wikipedia} target="_blank" rel="noreferrer">Подробнее о ракете</a></p>}
							</Row>

							{!!launch.crew.length && (
								<>
									<Divider orientation="left">Команда</Divider>

									<Row>
										{launch.crew.map(crew => (
											<div key={crew.crew.id} style={{ width: 230, marginRight: 30, marginBottom: 40 }}>
												<Image
													src={crew.crew.image}
													height={250}
													width={230}
													placeholder={<UserOutlined/>}
												/>
												<h3 style={{ margin: '10px 0 0' }}>{crew.crew.name}</h3>
												<p style={{ color: '#989898', marginBottom: 5 }}>{crew.role}</p>
												{crew.crew.wikipedia && <p><a href={crew.crew.wikipedia} target="_blank" rel="noreferrer">Википедия</a></p>}
											</div>
										))}
									</Row>
								</>
							)}


						</Col>

						<Col span={8}>
							<Gallery photos={launch.rocket.flickr_images}/>

							<div style={{ marginTop: 20 }}>
								{launch.links.wikipedia && <p><a href={launch.links.wikipedia} target="_blank" rel="noreferrer">Статья на Википедии</a></p>}
								{launch.links.webcast && <p><a href={launch.links.webcast} target="_blank" rel="noreferrer">Видео запуска</a></p>}
								{launch.links.article && <p><a href={launch.links.article} target="_blank" rel="noreferrer">Статья</a></p>}
							</div>
						</Col>
					</Row>
				</>
			)}
		</>
	)
}
