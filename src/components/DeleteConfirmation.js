import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default function DeleteConfirmation(props) {
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