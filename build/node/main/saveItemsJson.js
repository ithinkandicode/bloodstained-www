
// Dependancies
// ============================================================================

// Utils
const writeFile = require('../utils/file/writeFile');
const logError = require('../utils/log/logError');


// Functions
// ============================================================================

/**
 * Asynchronously stringify an itemsObj, then write it to disk
 *
 * @async
 *
 * @param   {string}  writePath    File path
 * @param   {string}  fileData     File data to write
 *
 * @return  {void}
 */
async function saveItemsJson( outputFilePath, itemsObj )
{
	let itemsJson= {};

	try
	{
		// Stringify
		itemsJson = JSON.stringify( itemsObj, null, '\t' );
	}
	catch( err )
	{
		logError( err );
	}

	try
	{
		// Save
		await writeFile( outputFilePath, itemsJson, true );
		return;
	}
	catch( err )
	{
		logError( err );
		return;
	}
}


// Exports
// ============================================================================

module.exports = saveItemsJson;
