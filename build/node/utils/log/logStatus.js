
// Modules
// ============================================================================

// NPM
const chalk = require('chalk');


// Functions
// ============================================================================

/**
 * Log a status message to the terminal
 *
 * Message types:
 *   - success   ─ Action: Successful with no issues ─ green
 *   - warn      ─ Action: Successful but with non-critical issues ─ yellow
 *   - error     ─ Action: Failed, critical issues ─ red
 *   - info      ─ Info: General ─ blue
 *   - important ─ Info: Important ─ cyan
 *   - misc      ─ Info: Non-essential ─ grey
 *   - dev       ─ Info: Developer notes, e.g. deprecated code usage ─ magenta
 *
 * @example logStatus( 'error', 'Action failed. Missing argument 1: "username"' )
 *
 * @param   {string}  type  Message type: success, warn, error, info, important, misc, dev
 * @param   {string}  msg   Message to log
 *
 * @return  {void}
 */
function logStatus( type, msg )
{
	if ( !msg )
	{
		// Equivalent to logStatus( 'dev', '...' )
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
