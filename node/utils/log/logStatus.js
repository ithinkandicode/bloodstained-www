
// Modules
// ============================================================================

// Native
const chalk = require('chalk');


// Functions
// ============================================================================

/**
 * Log a status messge to the terminal
 *
 * @param   {string}  type  Message type: info (blue), warn (yellow), success (green), error (red), important (cyan), misc (grey), dev (magenta)
 * @param   {string}  msg   Message to log
 *
 * @return  {void}
 */
function logStatus( type, msg )
{
	if ( !msg )
	{
		console.log( chalk.magenta( 'Expected message as a second arg in logStatus, but no message was supplied' ) );
		throw new Error( 'Bug in your code. Check logStatus args' );
	}

	let color = 'blue';

	switch( type )
	{
		case 'info':
			color = 'blue';
			break;

		case 'warn':
			color = 'yellow';
			break;

		case 'success':
			color = 'green';
			break;

		case 'error':
			color = 'red';
			break;

		// Important information
		case 'important':
			color = 'cyan';
			break;

		// Developer use (debugging)
		case 'dev':
			color = 'magenta';
			break;

		// General notes (verbose)
		case 'misc':
			color = 'gray';
			break;

		default:
			color = 'gray';
	}

	console.log( chalk[color]( msg ) );
}


// Exports
// ============================================================================

module.exports = logStatus;
