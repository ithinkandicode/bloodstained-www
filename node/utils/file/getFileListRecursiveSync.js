
// Dependancies
// ============================================================================

// Native
const fs = require('fs');
const path = require('path');


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
function getFileListRecursiveSync( dir, fileList = [], matchString = '' )
{
	const files = fs.readdirSync( dir );

	files.forEach( file =>
	{
		const filePath = path.join( dir, file );
		const isDirectory = fs.statSync( filePath ).isDirectory();

		if ( isDirectory )
		{
			fileList = getFileListRecursiveSync( filePath, fileList, matchString );
		}
		else
		{
			// Push only files with a path containing the supplied matchString
			if ( matchString.length )
			{
				if ( filePath.includes( matchString ) )
				{
					fileList.push( filePath );
				}
			}
			else
			{
				fileList.push( filePath );
			}
		}
	});

	return fileList;
}


// Exports
// ============================================================================

module.exports = getFileListRecursiveSync;
