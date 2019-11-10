
// Dependancies
// ============================================================================

// Native
const fs = require('fs');

// Utils
const logStatus = require('../log/logStatus');


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
function writeFile( writePath, fileData, log = false )
{
	return new Promise( ( resolve, reject ) =>
	{
		try
		{
			fs.writeFile( fileData, writePath, err =>
			{
				if ( err )
				{
					if ( log )
					{
						logStatus( 'error', 'Error writing file' );
					}

					reject( err );
				}

				logStatus( 'misc', 'WriteFile OK: ' + writePath );
				resolve();
			});
		}
		catch( err )
		{
			logStatus( 'error', 'Error writing file' );
			reject( err );
		}
	});
}


// Exports
// ============================================================================

module.exports = writeFile;
