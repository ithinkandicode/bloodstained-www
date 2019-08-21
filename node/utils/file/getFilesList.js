
// Dependancies
// ============================================================================

// Native
const fs = require('fs');

// Utils
const logStatus = require('../log/logStatus');


// Functions
// ============================================================================

/**
 * Retreive a list of files and directories. Returns a promise.
 *
 * @async
 *
 * @param   {string}  srcDir       Directory to read
 * @param   {boolean} [log=false]  True to log info
 *
 * @return  {Promise}              Resolves with an array of filename(s). Excludes the full path. Rejects with an error object
 */
function getFilesList( srcDir, log = false )
{
	return new Promise( ( resolve, reject ) =>
	{
		try
		{
			fs.readdir( srcDir, ( err, files ) =>
			{
				if ( err )
				{
					if ( log )
					{
						logStatus( 'error', 'Error getting file list' );
					}

					reject( err );
				}
				else
				{
					resolve( files );
				}
			});
		}
		catch( err )
		{
			if ( log )
			{
				logStatus( 'error', 'Error getting file list' );
			}

			reject( err );
		}
	});
}


// Exports
// ============================================================================

module.exports = getFilesList;
