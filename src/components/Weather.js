import React from 'react'

export default class Weather extends React.Component {
	handleClick() {
		let win = window.open(this.state.link, '_blank')
		win.focus()
	}

	render() {
		return (
			<div onClick={this.handleClick.bind(this)}>
				Temperatura: {this.props.weather.temp} °C<br/>
				Wilgotność: {this.props.weather.humidity} %<br/>
				Ogólnie: {this.props.weather.desc}
			</div>
		)
	}
}
