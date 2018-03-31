
export function computeFullName(firstName, surname) {
	return surname + (firstName? ", " + firstName: "")
}

export function computeCityCountry(city, country) {
	return city.toLowerCase() + ", " + country.toLowerCase()
}

// FIXME: everytime it is imported it recreates this function
export const getNextId = (function(startId) {
	let id = startId
	return function() {
		return id++
	}
})(1)


// FIXME: probably should not cache and leave this to caller
export function getWeather(city, countryCode) {
	if (typeof getWeather.cache === "undefined") getWeather.cache = {}
	let cityCountry = computeCityCountry(city, countryCode)
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

// for testing
// export function dummyPromise() {
// 	return new Promise(function(resolve, reject) {
// 		setTimeout(resolve, 3000)	
// 	})
// }