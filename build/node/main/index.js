
// Dependancies
// ============================================================================

// Utils
const writeFile = require('../utils/file/writeFile');
const logError = require('../utils/log/logError');


// Constants
// ============================================================================

const paths = {
	outputFile: '../../data/output/items.json',
};


// Functions
// ============================================================================

const getStringTableObject = require('./getStringTableObject');

async function init()
{
	const stringTable = await getStringTableObject();
	const stringTableKeys = Object.keys( stringTable );

	// Empty items object
	// Structure is `itemId: { name: 'Item name', explain: 'Item description' }`
	const itemsObj = {};

	// Stringified itemsObj, ready to be saved to disk
	let itemsJson = '';

	// Store a master array of item names and explains
	// Gives us a smaller data set to search later
	const itemNamesMaster = stringTableKeys.filter( key => key.startsWith( 'ITEM_NAME_' ) );
	const itemExplains = stringTableKeys.filter( key => key.startsWith( 'ITEM_EXPLAIN_') );

	itemNamesMaster.forEach( itemId =>
	{
		itemsObj[itemId] = {};

		const nameKey = itemNamesMaster.find( name => name === 'ITEM_NAME_' + itemId );
		const explainKey = itemExplains.find( explain => explain === 'ITEM_EXPLAIN_' + itemId );

		const itemName = stringTable[nameKey];
		const itemExplain = stringTable[explainKey];

		itemsObj[itemId] = {
			name: itemName,
			explain: itemExplain,
		};
	});

	try
	{
		itemsJson = JSON.stringify( itemsObj );
	}
	catch( err )
	{
		logError( err );
		return;
	}

	// Save the data
	await writeFile( paths.outputFile, itemsJson, true );
}


init();