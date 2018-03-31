import React from 'react';
import {getWeather, computeCityCountry} from '../js/auxiliary'

export default class WeatherContainer extends React.Component {
	constructor(props) {
		super(props)
		this.weatherExpirationTime = 720
		this.unmanagedState = { weathers: {}, weathersTimestamps: {} }
		this.fetchWeather()
		this.counter = 10
	}

	fetchWeather() {
		let weathers = Object.assign({}, this.unmanagedState.weathers)
		let timestamps = Object.assign({}, this.unmanagedState.weathersTimestamps)
		const currentTime = Math.round(new Date().getTime() / 1000);
		Promise.all(
			this.props.users.map( (user) => {
				const city = user.city
				const country = user.country
				const cityCountry = computeCityCountry(city, country)
				if (cityCountry in weathers && currentTime - timestamps[cityCountry] < this.weatherExpirationTime ) return Promise.resolve(false)
				//create entry early to prevent fetching for supsequent same city when previous request is not resolved yet
				timestamps[cityCountry] = currentTime
				return (
					//dummyPromise().then( () => {return true})
					getWeather(city, country)
						.then(function(resp) {
							weathers[cityCountry] = resp
							return true
						})
						.catch(function(err) {
							return false
						})			
				)			
			})
		).then( (answers) => {
			if (answers.some((answer) => answer)) {
				this.unmanagedState = Object.assign(this.unmanagedState, {weathers, weathersTimestamps: timestamps})
				this.props.onWeatherData(this.unmanagedState.weathers)
		}	
		})
		.catch( (err) => {console.log('sie ryplo', err)})
	}
	
	componentDidUpdate() {
		//FIXME: counter is only for testing to prevent infinite loop
		//FIXME: probably should use static getDerivedStateFromProps(nextProps, prevState) instead of unmanaged state to prevent state change triggering render
		if (this.counter > 0) {
			this.counter--			
			this.fetchWeather()
		}
	}

	render() {
		return null
	}
	
} 
