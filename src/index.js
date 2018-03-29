import React from 'react';
import ReactDOM from 'react-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import GenderFemale from 'mdi-material-ui/GenderFemale'
import GenderMale from 'mdi-material-ui/GenderMale'
import GenderMaleFemale from 'mdi-material-ui/GenderMaleFemale'
import Badge from 'material-ui/Badge'
import Avatar from 'material-ui/Avatar'
import Checkbox from 'material-ui/Checkbox'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import DeleteForever from 'material-ui/svg-icons/action/delete-forever'
import Add from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import "./index.css"

const SEX = {
	f: "kobieta",
	m: "mężczyzna",
	o: "inna"
}

function computeFullName(firstName, surname) {
	return surname + (firstName? ", " + firstName: "")
}

function getWeather(city, countryCode) {
	if (typeof getWeather.cache === "undefined") getWeather.cache = {}
	let cityCountry = city.toLowerCase() + ", " + countryCode.toLowerCase()
	let cache = getWeather.cache
	const currentTime = Math.round(new Date().getTime() / 1000);
	if (cityCountry in cache) {
		var cached = cache[cityCountry]
		if (currentTime - cached.timestamp < 720) {
			return Promise.resolve(cached)
		}
	}
	let q = `select link, atmosphere.humidity, item.condition, item.description from weather.forecast where woeid in (select woeid from geo.places(1) where text='${cityCountry}') and u='c'&format=json`
	let address = "https://query.yahooapis.com/v1/public/yql"
	let x = new Request(address + "?q=" + q)
	return fetch(x)
	.then(function(response) {
		return response.json()
	})
	.then(function(response) {
		const c = response.query.results.channel
		const link = c.link.split('*')[1]
		var answer = { 
			timestamp: currentTime,
			humidity: c.atmosphere.humidity,
			link: link,
			temp: c.item.condition.temp,
			desc: c.item.condition.text,
		}
		cache[cityCountry] = answer
		return answer
	})
}

function AvatarWithSexBadge(props) {
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

class Weather extends React.Component {
	// FIXME: weather data is probably not updated when city changes?

	constructor(props) {
		super(props)
		const city = props.city
		const country = props.country
		this.state = {weather: {}}
		getWeather(city, country)
		.then(function(resp) {
			this.setState(resp)
		}.bind(this))
		.catch(function(err) {
			console.log("Weather data not available", err)
		})
	}

	handleClick() {
		let win = window.open(this.state.link, '_blank')
		win.focus()
	}

	render() {
		return (
			<div onClick={this.handleClick.bind(this)}>
				Temperatura: {this.state.temp} °C<br/>
				Wilgotność: {this.state.humidity} %<br/>
				Ogólnie: {this.state.desc}
			</div>
		)
	}
}

function User(props) {
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
				<Weather city={city} country={country} />
			</CardText>
		</Card>
	)
}

function DeleteConfirmation(props) {
	const dialogActions = [
		<FlatButton label="Tak" secondary onClick={() => props.onConfirmed(true)} />,
		<FlatButton label="Nie" primary onClick={() => props.onConfirmed(false)} />
	]
	return (
		<Dialog 
			open={props.open}
			title="Potwierdź usunięcie"
			modal
			actions={dialogActions}
		>
			{props.message}
		</Dialog>
	)		
}

class AddEditUser extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			user: Object.assign({}, this.props.user),
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleAdd = this.handleAdd.bind(this)
		this.handleCancel = this.handleCancel.bind(this)
	}

	handleAdd() {
		this.props.onClose(this.state.user)
	}

	handleCancel() {
		this.props.onClose(null)
	}

	handleChange(field, event) {
		let value = field === "sex"? event: event.target.value
		let user = Object.assign(this.state.user, {[field]: value})
		this.setState({user})
	}

	render() {
		const actions = [
			<FlatButton label={this.state.user.userId !== null? "Zmień": "Dodaj"} primary onClick={this.handleAdd} />,
			<FlatButton label="Anuluj" primary onClick={this.handleCancel} />
		]
		return (
			<Dialog
				open={this.props.open}
				title="Dodawanie użytkownika"
				actions={actions}
			>
				<div>
					<TextField
						floatingLabelText="Imię"
						value={this.state.user.firstName}
						onChange={e => this.handleChange('firstName', e)}
					/>
				</div>
				<div>
					<TextField
						floatingLabelText="Nazwisko"
						value={this.state.user.surname}
						onChange={e => this.handleChange('surname', e)}
					/>
				</div>
				<div>
					<TextField
						floatingLabelText="Miasto"
						value={this.state.user.city}
						onChange={(e) => this.handleChange('city', e)}
					/>
				</div>
				<div>
					<TextField
						floatingLabelText="Kod kraju"
						value={this.state.user.country}
						onChange={(e) => this.handleChange('country', e)}
					/>
				</div>
				<div>
					<SelectField
						floatingLabelText="Płeć"
						value={this.state.user.sex}
						onChange={(e, i, v) => this.handleChange('sex', v)}
					>
						<MenuItem value={SEX.f} primaryText={SEX.f} />
						<MenuItem value={SEX.m} primaryText={SEX.m} />
						<MenuItem value={SEX.o} primaryText={SEX.o} />
					</SelectField>
				</div>
			</Dialog>
		)
	}
}

class Users extends React.Component {

	constructor(props) {
		super(props)
		const selected = this.computeSelected(null, props.users)
		this.state = {
			users: this.props.users.slice(),
			selected: selected,
			allSelected: false,
			showDeleteConfirm: false,
			deleteConfirmationMessage: null,
			currentUserId: null,
			showEditUser: false
		}
		this.handleAdd = this.handleAdd.bind(this)
	}

	componentDidMount() {
		this.setState({ users: this.sortUsers(this.state.users) })
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
		const idx = this.state.users.findIndex(item => item.userId === userIdToFind)
		return this.state.users[idx]
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
		this.setState({
			users: this.state.users.filter(({userId}) => userId !== this.state.currentUserId),
			showDeleteConfirm: false
		})
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
			users = this.state.users.filter( ({userId}) => userId !== editedId)
			users.push(userData)
		} else {
			// newly added user
			editedId = getNextId()
			userData.userId = editedId
			users = this.state.users.slice()
			users.push(userData)
			selected = this.computeSelected(this.state.selected, users)
		}
		users = this.sortUsers(users)
		if (selected) {
			this.setState({users, selected, showEditUser: false})
		} else {
			this.setState({users, showEditUser: false})
		}
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
				{this.state.users.map(
					(user) => <User key={user.userId} user={user} onSelect={this.handleSelect.bind(this, user.userId)} selected={this.state.selected[user.userId]} onDelete={this.handleDelete.bind(this, user.userId)} onEdit={this.handleEdit.bind(this, user.userId)} />
				)}
			</div>
		)
	}
}

const getNextId = (function(startId) {
	let id = startId
	return function() {
		return id++
	}
})(1)

const _emptyUser = {
	userId: null,
	firstName: "",
	surname: "",
	city: "",
	country: "",
	sex: SEX.o,
	avatar: ""	
}

const _users = [
	{
		userId: getNextId(),
		firstName: "Michał",
		surname: "Mierzwa",
		city: "Świętochłowice",
		country: "pl",
		sex: SEX.m,
		avatar: "https://avatarfiles.alphacoders.com/124/124839.png"
	},
	{
		userId: getNextId(),
		firstName: "Jolanta",
		surname: "Mierzwa",
		city: "Świętochłowice",
		country: "pl",
		sex: SEX.f,
		avatar: "https://avatarfiles.alphacoders.com/124/124350.jpg"
	}
]

function App(props) {
	//const style = { backgroundColor: props.darkTheme? "grey": "#f5f5f5"}
	const style = {}
	document.body.style.backgroundColor = props.darkTheme? "#505050": "#fafafa"
	let titleStyle = { color: props.darkTheme? "white": "black" }
	return (
		<MuiThemeProvider muiTheme={props.darkTheme? getMuiTheme(darkBaseTheme): null}>
			<div>
				<AppBar title="Użytkownicy" showMenuIconButton={false} style={style} titleStyle={titleStyle} />
				<div className="content">
					<Users users={_users} />
				</div>
			</div>
		</MuiThemeProvider>			
	);
}

ReactDOM.render(
	<App  darkTheme={false} />,	
	document.getElementById('root')
)


/*

TODO: 

* add button for theme changing
* present weather nicely, maybe using icons?
* when adding user check if already exists

*/