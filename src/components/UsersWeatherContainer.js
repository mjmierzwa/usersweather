import React from 'react';
import WeatherContainer from './WeatherContainer'
import Users from './Users'
import {computeFullName} from '../js/auxiliary'

export default class UsersWeatherContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 
			users: this.sortUsers(this.props.users),
			weathers: {}
		}
		this.handleWeatherData = this.handleWeatherData.bind(this)
		this.handleUsersChanged = this.handleUsersChanged.bind(this)
	}

	sortUsers(usersToSort) {
		const users = usersToSort.sort((a, b) => {
			const afull = computeFullName(a.firstName, a.surname)
			const bfull = computeFullName(b.firstName, b.surname)
			if (afull === bfull) return 0
			if (afull < bfull) return -1
			return 1
		})
		return users
	}

	handleWeatherData(weathers) {
		this.setState({weathers})
	}

	handleUsersChanged(users) {
		const sortedUsers = this.sortUsers(users)
		this.setState({users: sortedUsers})
	}

	render() {
		return (
			<React.Fragment>
				<WeatherContainer users={this.state.users} onWeatherData={this.handleWeatherData} />
				<Users users={this.state.users} weathers={this.state.weathers} onUsersChanged={this.handleUsersChanged} />
			</React.Fragment>
		)
	}
}