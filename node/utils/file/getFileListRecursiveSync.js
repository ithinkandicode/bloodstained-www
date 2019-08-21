
// Dependancies
// ============================================================================

// Native
const fs = require('fs');
const path = require('path');
const util = require('util');


// Promisified
// ============================================================================

const statPromise = util.promisify(fs.stat);
const readdirPromise = util.promisify(fs.readdir);


// Functions
// ============================================================================

/**
 * SYNCHRONOUSLY get a list all files in a directory and its subdirectories.
 *
 * Returns an array of filenames, including their full paths.
 *
 * @param   {string} dir       Directory
 * @param   {array}  fileList  Array of files. Only used internally, for recursive directory walking
 * @return  {array}            Array of files
 */
function getFileListRecursiveSync( dir, fileList = [] )
{
	const files = fs.readdirSync(dir);

	files.forEach( file =>
	{
		const filePath = path.join( dir, file );
		const isDirectory = fs.statSync( filePath ).isDirectory();

		if ( isDirectory )
		{
			fileList = getFileListRecursiveSync( filePath, fileList);
		}
		else
		{
			fileList.push( filePath );
		}
	});

	return fileList;
}


/**
 * Get a list of all files in a directory
 *
 * @link https://stackoverflow.com/a/52193051
 *
 * @async
 *
 * @param   {string}  dir  The directory to inventory
 *
 * @return  {Array}        Array of files
 */
async function getFileListRecursive( dir )
{
	// Get this directory's contents
	const files = await readdirPromise( dir );

	// Wait on all the files of the directory
	const getFilesPromise = Promise.all( files
		// Prepend the directory this file belongs to
		.map( f => path.join( dir, f ) )

		// Iterate the files and see if we need to recurse by type
		.map( async f =>
		{
			// See what type of file this is
			const stats = await statPromise( f );

			// Recurse if it is a directory, otherwise return the filepath
			return stats.isDirectory() ? getFileListRecursive( f ) : f;
		}));

	return getFilesPromise;
}



// Exports
// ============================================================================

module.exports = getFileListRecursiveSync;
