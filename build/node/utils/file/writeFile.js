
// Dependancies
// ============================================================================

// Native
const fs = require('fs');
const { promisify } = require('util');

// Utils
const logStatus = require('../log/logStatus');
const logError = require('../log/logError');

// Promisified
const writeFilePromise = promisify( fs.writeFile );


// Functions
// ============================================================================

/**
 * Asynchronously write data to a single file
 *
 * Throws an error on failure
 *
 * @async
 *
 * @param   {string}   writePath    File path
 * @param   {string}   fileData     File data to write
 * @param   {boolean}  [log=false]  True to log info
 *
 * @return  {Boolean}  Returns true if successful. Throws an error on failure
 */
async function writeFile( writePath, fileData, log = false )
{
	if ( !writePath )
	{
		throw new Error( 'No path was supplied to writeFile, or path was undefined. Check your args' );
	}

	if ( typeof fileData !== 'string' )
	{
		throw new Error( `writeFile expected fileData as string, but type was "${typeof fileData}"` );
	}

	try
	{
		await writeFilePromise( writePath, fileData );

		if ( log )
		{
			logStatus( 'misc', 'WriteFile OK: ' + writePath );
		}

		return true;
	}
	catch( err )
	{
		if ( log )
		{
			logError( err );
		}

		throw new Error( 'Error writing file' );
	}
}


// Exports
// ============================================================================

module.exports = writeFile;
