
// Dependancies
// ============================================================================

// Custom
const getJsonFileAsObject = require('../utils/file/getJsonFileAsObject');

// Utils
const logStatus = require('../utils/log/logStatus');
const logError = require('../utils/log/logError');
const writeFile = require('../utils/file/writeFile');


// Constants
// ============================================================================

const paths = {
	itemsById: '../data/output/items.json',
	outputCsv: '../data/output/found-items.csv',
};


// Functions
// ============================================================================

async function lookupIdsByName( itemIds = [] )
{
	let itemsObj = {};
	let foundItemsObj = [];

	try
	{
		itemsObj = await getJsonFileAsObject( paths.itemsById );

		const itemKeys = Object.keys( itemsObj );

		for( const itemKey of itemKeys )
		{
			if ( itemIds.includes( itemKey ) )
			{
				foundItemsObj.push( itemsObj[itemKey] );
			}
		}
	}
	catch( err )
	{
		logError( 'Error when trying to get JSON file as object' );
		logError( err );
	}

	return foundItemsObj;
}

async function lookup( itemIdsToLookup = [], log = false )
{
	let foundItemsArr = [];
	let foundItemsCount = 0;

	foundItemsArr = await lookupIdsByName( itemIdsToLookup );
	foundItemsCount = foundItemsArr.length;

	if ( log )
	{
		if ( !foundItemsCount )
		{
			logStatus( 'warn', 'Found 0 items' );
			return [];
		}
		else
		{
			logStatus( 'success', `Found ${foundItemsCount} items` );
		}
	}

	return foundItemsArr;
}

/**
 * @todo Re-write as utility, accepting array of keys to use as cells in a row, plus optional header cells
 */
async function itemsArrToCsv( itemsArr = [], log = false )
{
	const csvArr = [];
	const csvStr = '';

	if ( !itemsArr.length )
	{
		if ( log )
		{
			logStatus( 'warn', 'Items array was empty. Returned string will be empty' );
			return csvStr;
		}
	}

	// We could use foreach here, but as foreach doesn't work with async, it's best practise to avoid it
	for( const itemObj of itemsArr )
	{
		csvArr.push( itemObj.id + '\t' + itemObj.name );
	}

	return csvArr.join( '\n' );
}


async function lookupItemsByIdAndSaveCsv( itemIds, logCsv = false )
{
	const foundItems = await lookup( itemIds, true );

	if ( foundItems.length )
	{
		const csvStr = await itemsArrToCsv( foundItems );

		if ( logCsv )
		{
			console.log( csvStr );
		}

		try
		{
			await writeFile( paths.outputCsv, csvStr, true );
			logStatus( 'success', 'Success! CSV file was written to disk' );
		}
		catch( err )
		{
			logError( 'Error occured when trying to write CSV file to disk' );
			logError( err );
		}
	}
}


// Export
// ============================================================================

module.exports = lookupItemsByIdAndSaveCsv;
