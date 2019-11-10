
// Modules
// ============================================================================

// Utils
const logStatus = require('./logStatus');


// Functions
// ============================================================================

/**
 * Log an error message to the terminal
 *
 * @example logError( err )
 *
 * @param   {Object}   err               Error object
 * @param   {boolean}  [logStack=false]  If true, attempts to log the stack (if supplied), in addition to the error message
 *
 * @return  {void}
 */
function logError( err, logStack = false )
{
	let canLogStack = logStack;

	if ( logStack )
	{
		// Make sure we have a stack to log
		const isErrorObject = typeof err === 'object' && Object.prototype.hasOwnProperty.call( err, 'message' ) && Object.prototype.hasOwnProperty.call( err, 'stack' );

		if ( isErrorObject )
		{
			canLogStack = true;
		}
	}

	if ( canLogStack )
	{
		logStatus( 'error', err.message );
		logStatus( 'error', err.stack );
	}
	else
	{
		logStatus( 'error', err );
	}
}


// Exports
// ============================================================================

module.exports = logError;
