
// Dependancies
// ============================================================================

// Native
const fs = require('fs');
const { promisify } = require('util');

// Utils
const logStatus = require('../log/logStatus');
const logError = require('../log/logError');

// Promisified
const readFilePromise = promisify( fs.readFile );


// Functions
// ============================================================================

/**
 * Asynchronously read the contents of a single file, and return it as a string
 *
 * Throws an error on failure
 *
 * @async
 *
 * @param   {string}   filePath     File path
 * @param   {boolean}  [log=false]  True to log info
 *
 * @return  {string}   File data string if succesful. Throws an error on failure
 */
async function readFile( filePath, log = false )
{
	try
	{
		const data = await readFilePromise( filePath, 'utf8' );

		if ( log )
		{
			logStatus( 'misc', 'ReadFile OK: ' + filePath );
		}

		return data;
	}
	catch( err )
	{
		if ( log )
		{
			logError( err );
		}

		throw new Error( 'Error reading file' );
	}
}


// Exports
// ============================================================================

module.exports = readFile;
