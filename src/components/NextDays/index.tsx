import './styles.css'
import { NextDayItemProps, NextDaysItem } from '../NextDaysItem'

interface Props {
	data: NextDayItemProps[]
}

export function NextDays({ data }: Props) {
	return (
		<section className="next-days">
			<h1>Previsão para 5 dias</h1>

			<div className="next-next-detail">
				{data.map((item) => (
					<NextDaysItem key={item.day} data={item} />
				))}
			</div>
		</section>
	)
}
