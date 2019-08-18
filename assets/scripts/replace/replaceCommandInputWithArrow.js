// Returns an empty string if not command was specified
function replaceCommandInputWithArrow( command )
{
	let newCommand = '';

	if ( !command )
	{
		return newCommand;
	}

	switch ( command )
	{
		case 'Attack':
			newCommand = 'A';
			break;

		case '1':
			newCommand = '↙';
			break;

		case '2':
			newCommand = '↓';
			break;

		case '3':
			newCommand = '↘';
			break;

		case '4':
			newCommand = '←';
			break;

		case '5':
			newCommand = '-';
			break;

		case '6':
			newCommand = '→';
			break;

		case '7':
			newCommand = '↖';
			break;

		case '8':
			newCommand = '↑';
			break;

		case '9':
			newCommand = '↗';
			break;
	}

	return newCommand;
}

export { replaceCommandInputWithArrow };
