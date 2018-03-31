import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem';
import {SEX} from '../js/consts'


export default class AddEditUser extends React.Component {

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
