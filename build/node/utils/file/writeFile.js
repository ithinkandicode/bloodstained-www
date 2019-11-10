
// Dependancies
// ============================================================================

// Native
const fs = require('fs');

// Utils
const logStatus = require('../log/logStatus');
const logError = require('../log/logError');

// Functions
// ============================================================================

/**
 * Asynchronously write data to a single file
 *
 * @async
 *
 * @param   {string}  writePath    File path
 * @param   {string}  fileData     File data to write
 * @param   {boolean} [log=false]  True to log info
 *
 * @return  {Promise}              Resolves with nothing. Rejects with error object
 */
async function writeFile( writePath, fileData, log = false )
{
	return new Promise( ( resolve, reject ) =>
	{
		try
		{
			fs.writeFile( writePath, fileData, err =>
			{
				if ( err )
				{
					if ( log )
					{
						logStatus( 'error', 'Error writing file' );
						logError( err );
					}

					reject( err );
				}

				if ( log )
				{
					logStatus( 'misc', 'WriteFile OK: ' + writePath );
				}

				resolve();
			});
		}
		catch( err )
		{
			if ( log )
			{
				logStatus( 'error', 'Error writing file' );
				logError( err );
			}

			reject( err );
		}
	});
}


// Exports
// ============================================================================

module.exports = writeFile;
