
// Dependancies
// ============================================================================

// Native
const fs = require('fs');

// Utils
const logStatus = require('../log/logStatus');


// Functions
// ============================================================================

/**
 * Asynchronously get the contents of a single file
 *
 * @async
 *
 * @param   {string}  filePath     File path
 * @param   {boolean} [log=false]  True to log info
 *
 * @return  {Promise}               Resolves with file data. Rejects with error object
 */
async function readFile( filePath, log )
{
	return new Promise( ( resolve, reject ) =>
	{
		try
		{
			fs.readFile( filePath, 'utf8', ( err, data ) =>
			{
				if ( err )
				{
					if ( log )
					{
						logStatus( 'error', 'Error reading file' );
					}

					reject( err );
				}

				logStatus( 'misc', 'ReadFile OK: ' + filePath );
				resolve( data );
			});
		}
		catch( err )
		{
			if ( log )
			{
				logStatus( 'error', 'Error reading file' );
			}

			reject( err );
		}
	});
}


// Exports
// ============================================================================

module.exports = readFile;
