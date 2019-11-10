
// Dependancies
// ============================================================================

// Custom
const buildItemsJson = require('./buildItemsJson');
const saveItemsJson = require('./saveItemsJson');


// Constants
// ============================================================================

const paths = {
	outputFile: '../../data/output/items.json',
};


// Functions
// ============================================================================

async function init()
{
	// Build items object
	const itemsObj = buildItemsJson();

	// Save items JSON
	await saveItemsJson( paths.outputPath, itemsObj );
}


// Auto Init
// ============================================================================

init();
