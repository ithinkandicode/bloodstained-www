
// Dependancies
// ============================================================================

// Native
const fs = require('fs');
const { promisify } = require('util');

// Utils
const logStatus = require('../log/logStatus');
const logError = require('../log/logError');

// Promisified
const statPromise = promisify( fs.stat );
const mkdirPromise = promisify( fs.mkdir );


// Functions
// ============================================================================

/**
 * Asynchronously check if a path exists, and optionally create one it it
 * doesn't.
 *
 * @async
 *
 * @param   {string}   path         Path to check
 * @param   {Boolean}  makeDir      True to make the path if it doesn't exist
 * @param   {Boolean}  [log=false]  True to log status
 *
 * @return  {Boolean}  Returns true if a path exists. If it does not, and makeDir is true, makes the path and returns true. Otherwise returns false
 */
async function checkPath( path, makeDir = false, log = false )
{
	try
	{
		await statPromise( path );
		return true;
	}
	catch( err )
	{
		if ( makeDir )
		{
			try
			{
				await mkdirPromise( path );

				if ( log )
				{
					logStatus( 'success', 'Created path: ' + path );
				}

				return true;
			}
			catch (err)
			{
				if ( log )
				{
					logError( 'Path does not exist, AND failed to make path: ' + "\n" + path );
				}

				return false;
			}
		}

		if ( log )
		{
			logError( 'Path does not exist: ' + path );
		}

		return false;
	}
}


// Exports
// ============================================================================

module.exports = checkPath;
