import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'

import "./index.css"

ReactDOM.render(
	<App  darkTheme={false} />,	
	document.getElementById('root')
)


/*

TODO: 

* add button for theme changing
* present weather nicely, maybe using icons?
* when adding user check if already exists
* my idea to fetch weather data for users is wrong, it should fetch weather data only when actually user card is expanded, on the other hand then it would make user waiting for this data to appear...

*/