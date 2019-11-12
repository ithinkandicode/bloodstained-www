
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

		itemKeys.forEach( itemKey =>
		{
			if ( itemIds.includes( itemKey ) )
			{
				foundItemsObj.push( itemsObj[itemKey] );
			}
		});
	}
	catch( err )
	{
		logError( 'Error when trying to get JSON file as object' )
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

	itemsArr.forEach( itemObj =>
	{
		csvArr.push( itemObj.id + '\t' + itemObj.name );
	});

	return csvArr.join( '\n' );
}


async function init()
{
	const itemIdsToLookup = [
		// 'nothing',
		'AriesHorns',
		'Headband',
	];

	const foundItems = await lookup( itemIdsToLookup, true );

	if ( foundItems.length )
	{
		const csvStr = await itemsArrToCsv( foundItems );

		console.log(csvStr);

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


// Auto Init
// ============================================================================

init();
