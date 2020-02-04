
// Dependancies
// ============================================================================

// Utils
const readFile = require('./readFile');
const logError = require('../log/logError');
const logStatus = require('../log/logStatus');


// Functions
// ============================================================================

/**
 * Asynchronously get data form a JSON file and parse it
 *
 * Throws an error on failure
 *
 * @async
 *
 * @param   {string}   filePath     File path
 * @param   {Boolean}  [log=false]  True to log status
 *
 * @return  {Object}   File data string if succesful. Throws an error on failure
 */
async function getJsonFileAsObject( jsonFilePath, log = false )
{
	let fileData = null;
	let parsedFileData = null;

	// Read
	try
	{
		fileData = await readFile( jsonFilePath, true );

		if ( log )
		{
			logStatus( 'misc', 'JSON file read OK' );
		}
	}
	catch( err )
	{
		logError( err );
		throw new Error( 'Failed to read stringTable JSON data file' );
	}

	// Parse to obj
	try
	{
		parsedFileData = JSON.parse( fileData );

		if ( log )
		{
			logStatus( 'misc', 'JSON data parse OK' );
		}
	}
	catch( err )
	{
		logError( err );
		throw new Error( 'Failed to parse stringTable JSON into an object' );
	}

	return parsedFileData;
}


// Export
// ============================================================================

module.exports = getJsonFileAsObject;
