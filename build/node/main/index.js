
// Dependancies
// ============================================================================

// Custom
const getJsonFileAsObject = require('../utils/file/getJsonFileAsObject');
const buildItemsJson = require('./buildItemsJson');
const saveItemsJson = require('./saveItemsJson');

// Utils
const logError = require('../utils/log/logError');


// Constants
// ============================================================================

const paths = {
	stringTable: '../data/input/stringtable/PBMasterStringTable.json',
	outputFile: '../data/output/items.json',
};

// Functions
// ============================================================================

async function init()
{
	try
	{
		// Get string table data
		const parsedStringTableJson = await getJsonFileAsObject( paths.stringTable );

		// Where the good stuff is
		const stringTable = parsedStringTableJson.Table;

		// Build items object
		const itemsObj = await buildItemsJson( stringTable );

		// Save items JSON
		await saveItemsJson( paths.outputFile, itemsObj );
	}
	catch( err )
	{
		logError( err );
		logError( 'BUILD FAILED' );
	}
}


// Auto Init
// ============================================================================

init();
