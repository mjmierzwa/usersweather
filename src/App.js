import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import UsersWeatherContainer from './components/UsersWeatherContainer'
import {_users} from './js/consts'


export default function App(props) {
	//const style = { backgroundColor: props.darkTheme? "grey": "#f5f5f5"}
	const style = {}
	document.body.style.backgroundColor = props.darkTheme? "#505050": "#fafafa"
	let titleStyle = { color: props.darkTheme? "white": "black" }
	return (
		<MuiThemeProvider muiTheme={props.darkTheme? getMuiTheme(darkBaseTheme): null}>
			<div>
				<AppBar title="Użytkownicy" showMenuIconButton={false} style={style} titleStyle={titleStyle} />
				<div className="content">
					<UsersWeatherContainer users={_users} />
				</div>
			</div>
		</MuiThemeProvider>			
	);
}
