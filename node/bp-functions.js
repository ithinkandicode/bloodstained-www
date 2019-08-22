/*
Get a list of files with "Blueprint" in their full path
node ./node/bp-functions.js D:\GameTools\Mods\Bloodstained\BS-DATA\1.03\out\BloodstainedRotN\Content\Core\Environment
*/


const getFileListRecursiveSync = require('./utils/file/getFileListRecursiveSync');
const getFileListRecursive = require('./utils/file/getFileListRecursive');
const writeFile = require('./utils/file/writeFile');

async function init()
{
	const DIR = process.argv[2];
	const OUT = process.argv[3];

	if ( !DIR )
	{
		console.log( 'Supply directory as first argument' );
	}

	const files = getFileListRecursiveSync( DIR, [], 'Blueprint' );
	// const files = getFileListRecursiveSync( DIR );

	// const bpFiles = files.filter( f => f.includes( 'Blueprint' ) );
	// const bpFilesStr = bpFiles.join('\n');

	console.log(files);
}

init();