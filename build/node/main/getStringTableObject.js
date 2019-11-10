
// Dependancies
// ============================================================================

// Utils
const readFile = require('../utils/file/readFile');
const logError = require('../utils/log/logError');


// Constants
// ============================================================================

const paths = {
	stringTable: '../../data/input/stringtable/PBMasterStringTable.json',
};


// Functions
// ============================================================================

async function getStringTableObject()
{
	const stringTableData = await readFile( paths.stringTable, true );
	let parsedStringTableData = null;

	try
	{
		parsedStringTableData = JSON.parse( stringTableData );
	}
	catch( err )
	{
		logError( err );
	}

	const stringTable = parsedStringTableData.Table;

	return stringTable;
}


// Export
// ============================================================================

module.exports = getStringTableObject;
