import React from 'react'
import GenderFemale from 'mdi-material-ui/GenderFemale'
import GenderMale from 'mdi-material-ui/GenderMale'
import GenderMaleFemale from 'mdi-material-ui/GenderMaleFemale'
import Badge from 'material-ui/Badge'
import Avatar from 'material-ui/Avatar'
import {SEX} from '../js/consts'

export default function AvatarWithSexBadge(props) {
	const avatar = props.avatar
	const sex = props.sex
	let badge
	if (sex === SEX.f) {
		badge	= <GenderFemale style={{color: "pink"}} />
	} else if (sex === SEX.m) {
		badge	= <GenderMale style={{color: "blue"}} />
	} else {
		badge	= <GenderMaleFemale style={{color: "purple"}} />
	}
	return (
		<Badge
			badgeContent={badge}
			badgeStyle={{top: 8, right: 8}}
		>
			<Avatar src={avatar} />
		</Badge>		
	)
}
