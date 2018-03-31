import React from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import Checkbox from 'material-ui/Checkbox'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import DeleteForever from 'material-ui/svg-icons/action/delete-forever'
import Weather from './Weather'
import AvatarWithSexBadge from './AvatarWithSexBadge'
import {computeFullName} from '../js/auxiliary'

export default function User(props) {
	const surname = props.user.surname
	const firstName = props.user.firstName
	const avatar = props.user.avatar
	const sex = props.user.sex
	const city = props.user.city
	const country = props.user.country
	const fullName = computeFullName(firstName, surname)
	return (
		<Card>
			<CardHeader
				actAsExpander
				showExpandableButton
				title={fullName}
				titleStyle={{fontSize:18 + 'px'}}
				textStyle={{verticalAlign: "50%"}}
				avatar={<AvatarWithSexBadge avatar={avatar} sex={sex} />}
				style={{paddingTop: 0, paddingBottom: 0}}
			/>
			<CardActions>
				<div style={{display: "flex"}}>
				<Checkbox label="wybierz użytkownika" checked={props.selected} onCheck={props.onSelect} />
				<FloatingActionButton mini onClick={props.onEdit} style={{marginRight: 20}}>
					<ModeEdit />
				</FloatingActionButton>
				<FloatingActionButton secondary mini onClick={props.onDelete} style={{marginRight: 20}}>
					<DeleteForever />
				</FloatingActionButton>
				</div>
			</CardActions>
			<CardText expandable={true}>
				{city}
				<Weather city={city} country={country} weather={props.weather} />
			</CardText>
		</Card>
	)
}
