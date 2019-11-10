
// Dependancies
// ============================================================================

// Utils
const writeFile = require('../utils/file/writeFile');
const logError = require('../utils/log/logError');

// Custom
const getStringTableObject = require('./getStringTableObject');


// Constants
// ============================================================================

const paths = {
	outputFile: '../../data/output/items.json',
};


// Functions
// ============================================================================

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

	itemNamesMaster.forEach( itemNameId =>
	{
		const itemId = itemNameId.replace( 'ITEM_NAME_', '' );

		itemsObj[itemId] = {};

		const nameKey = itemNamesMaster.find( name => name === 'ITEM_NAME_' + itemId );
		const explainKey = itemExplains.find( explain => explain === 'ITEM_EXPLAIN_' + itemId );

		const itemName = stringTable[nameKey];
		let itemExplain = stringTable[explainKey];

		// Replace breaks in itemExplain
		itemExplain = itemExplain.replace( '\r\n', ' ' );

		// Replace double spaces, caused by the above replace!
		itemExplain = itemExplain.replace( '  ', ' ' );

		itemsObj[itemId] = {
			name: itemName,
			explain: itemExplain,
		};
	});

	try
	{
		itemsJson = JSON.stringify( itemsObj, null, '\t' );
	}
	catch( err )
	{
		logError( err );
		return;
	}

	try
	{
		// Save the data
		await writeFile( paths.outputFile, itemsJson, true );
	}
	catch( err )
	{
		logError( err );
	}

}


init();