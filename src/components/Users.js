import React from 'react';
import AddEditUser from './AddEditUser'
import DeleteConfirmation from './DeleteConfirmation'
import AppBar from 'material-ui/AppBar';
import Checkbox from 'material-ui/Checkbox'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Add from 'material-ui/svg-icons/content/add'
import User from './User'
import {_emptyUser} from '../js/consts'
import {getNextId, computeFullName, computeCityCountry} from '../js/auxiliary'


export default class Users extends React.Component {

	constructor(props) {
		super(props)
		const selected = this.computeSelected(null, props.users)
		this.state = {
			selected: selected,
			allSelected: false,
			showDeleteConfirm: false,
			deleteConfirmationMessage: null,
			currentUserId: null,
			showEditUser: false
		}
		this.handleAdd = this.handleAdd.bind(this)
	}

	computeSelected(oldSelected, users) {
		let selected = {}
		for (const user of users) {
			selected[user.userId] = oldSelected && oldSelected[user.userId]? oldSelected[user.userId]: false
		}
		return selected
	}

	getUserById(userIdToFind) {
		if (userIdToFind === null) return null
		const idx = this.props.users.findIndex(item => item.userId === userIdToFind)
		return this.props.users[idx]
	}

	handleSelect(userId) {
		this.setState( (oldState) => {
			let selected = Object.assign({}, oldState.selected)
			selected[userId] = !selected[userId]
			return {selected}
		})
	}

	handleSelectAll() {
		this.setState( (oldState) => {
			let selected = Object.assign({}, oldState.selected)
			let selectedAll = !oldState.allSelected
			for(let k in selected) {
				selected[k] = selectedAll
			}
			return {selected: selected, allSelected: selectedAll}
		})		
	}

	handleDelete(userIdToDelete) {
		const currentUser = this.getUserById(userIdToDelete)
		const message = "Czy na pewno chcesz usunąć użytkownika: " + computeFullName(currentUser.firstName, currentUser.surname)
		this.setState({
			deleteConfirmationMessage: message,
			showDeleteConfirm: true,
			currentUserId: userIdToDelete
		})
	}

	handleDeleteConfirmed(confirmed) {
		if (!confirmed) {
			this.setState({ showDeleteConfirm: false })
			return
		}
		//Fixme: send event to owner that users changed
		const filteredUsers = this.props.users.filter(({userId}) => userId !== this.state.currentUserId)
		this.setState({
			showDeleteConfirm: false
		})
		this.props.onUsersChanged(filteredUsers)
	}

	handleEdit(userIdToEdit) {
		this.setState({
			currentUserId: userIdToEdit,
			showEditUser: true
		})
	}

	handleEdited(userData) {
		if (userData === null) {
			this.setState({showEditUser: false})
			return
		}
		let editedId = userData.userId
		let users
		let selected = null
		if (editedId != null) {
			// edited existing user
			users = this.props.users.filter( ({userId}) => userId !== editedId)
			users.push(userData)
		} else {
			// newly added user
			editedId = getNextId()
			userData.userId = editedId
			users = this.props.users.slice()
			users.push(userData)
			selected = this.computeSelected(this.state.selected, users)
		}
		if (selected) {
			this.setState({selected, showEditUser: false})
		} else {
			this.setState({showEditUser: false})
		}
		this.props.onUsersChanged(users)
	}

	handleAdd() {
		this.setState({
			currentUserId: null,
			showEditUser: true
		})
	}

	render() {
		return (
			<div>
				{this.state.showEditUser?
					<AddEditUser 
						open={this.state.showEditUser}
						onClose={this.handleEdited.bind(this)}
						user={this.state.currentUserId? this.getUserById(this.state.currentUserId): _emptyUser}
					/>
					: null
				}
				<DeleteConfirmation 
					onConfirmed={this.handleDeleteConfirmed.bind(this)} 
					open={this.state.showDeleteConfirm}
					message={this.state.deleteConfirmationMessage}
				/>
				<AppBar
					style={{backgroundColor: "silver"}}			
					iconElementLeft={<Checkbox label="wybierz wszystkich" checked={this.state.allSelected} onCheck={this.handleSelectAll.bind(this)} />}
					iconStyleLeft={{width: 30 + '%'}}
					iconElementRight={
						<FloatingActionButton mini onClick={this.handleAdd} style={{marginRight: 20}}>
							<Add />
						</FloatingActionButton>
					}
				>				
				</AppBar>
				{this.props.users.map(
					(user) => {
						const cityCountry = computeCityCountry(user.city, user.country)
						const weather = (cityCountry in this.props.weathers)? this.props.weathers[cityCountry]: {}
						return (
							<User 
								key={user.userId} 
								user={user} 
								weather={weather}
								onSelect={this.handleSelect.bind(this, user.userId)} 
								selected={this.state.selected[user.userId]} 
								onDelete={this.handleDelete.bind(this, user.userId)} 
								onEdit={this.handleEdit.bind(this, user.userId)} 
							/>
						)
					}
			)}
			</div>
		)
	}
}
