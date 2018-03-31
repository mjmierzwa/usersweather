import {getNextId} from './auxiliary'

const SEX = {
	f: "kobieta",
	m: "mężczyzna",
	o: "inna"
}

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


export {SEX, _emptyUser, _users}