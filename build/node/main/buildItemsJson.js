
// Dependancies
// ============================================================================

// NA


// Functions
// ============================================================================

/**
 * Compiles a JSON file listing items by ID
 *
 * Each item is an object with keys for the item name (`name`) and its description (`explain`)
 */
async function buildItemsJson( stringTable )
{
	const stringTableKeys = Object.keys( stringTable );

	// Empty items object
	// Structure is `itemId: { name: 'Item name', explain: 'Item description' }`
	const itemsObj = {};

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
			id: itemId,
			name: itemName,
			explain: itemExplain,
		};
	});

	return itemsObj;
}


// Exports
// ============================================================================

module.exports = buildItemsJson;
