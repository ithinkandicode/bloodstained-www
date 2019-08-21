
// Dependancies
// ============================================================================

// Native
const fs = require('fs');
const { promisify } = require('util');

// Utils
const logStatus = require('../log/logStatus');

// Promisified
const statPromise = promisify( fs.stat );
const mkdirPromise = promisify( fs.mkdir );


// Functions
// ============================================================================

/**
 * Asynchronously check if a path exists, and optionally create one it it
 * doesn't
 *
 * Returns a BOOLEAN, not a promise
 *
 * @async
 *
 * @param   {string}   path     Path to check
 * @param   {Boolean}  makeDir  True to make the path if it doesn't exist
 * @param   {Boolean}  log      True to log status
 *
 * @return  {Promise}           Resolves if the path exists, or if it was successfully created. Otherwise, rejects with error object
 */
async function checkPath( path, makeDir = false, log = false )
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			await statPromise( path );
			resolve();
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

					resolve();
				}
				catch (err)
				{
					if ( log )
					{
						logStatus( 'error', 'Failed to make path: ' + path );
					}

					reject( err );
				}
			}

			if ( log )
			{
				logStatus( 'error', 'Path does not exist: ' + path );
			}

			reject( err );
		}
	});
}


// Exports
// ============================================================================

module.exports = checkPath;
