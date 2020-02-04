/*
cd c:\pr\Github\ithinkandicode\bloodstained\bloodstained-www\build\node
node main
*/

const generateAndSaveItemsJson = require('./generateAndSaveItemsJson');
const lookupIdsByNameAndSaveToCsv = require('./lookupIdsByNameAndSaveToCsv');

async function init()
{
	const itemIdsToLookup = [
		'RemoteDart',
		'OracleBlade',
		'WalalSoulimo',
		'ValralAltar',
		'ShieldWeapon',
	];

	// Generate items.json
	// await generateAndSaveItemsJson();

	// Lookua.p item IDs + save to CSV
	await lookupIdsByNameAndSaveToCsv( itemIdsToLookup );
}


init();
