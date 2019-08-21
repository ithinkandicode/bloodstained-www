
// Dependancies
// ============================================================================

// Native
const fs = require('fs');
const path = require('path');

// Utils
const logStatus = require('../log/logStatus');


// Functions
// ============================================================================

/**
 * Rename a single file asynchronously. Supply destDir to also move the file.
 * Returns a promise.
 *
 * @async
 *
 * @param   {string}   filename        Filename (including extension)
 * @param   {string}   search          Rename search string
 * @param   {string}   replace         Rename replace string
 * @param   {string}   srcDir          Source file directory
 * @param   {string}   [destDir]       Destination file directory. Set to false to rename files within their current directory (optional)
 * @param   {Boolean}  [copy=true]     True to copy files, false to move them. Set to false to delete the orignal files after renaming them
 * @param   {boolean}  [log=false]     True to log info
 *
 * @return  {Promise}                  Promise which resolves on rename completion, passing the new full file path. Rejected promise on error, passing the error object
 */
function renameSingleFile( filename, search, replace, srcDir, destDir, copy = true, log = false )
{
	return new Promise( ( resolve, reject ) =>
	{
		if ( search === replace )
		{
			if ( log )
			{
				logStatus( 'warning', 'Search and replace strings are identical' );
			}

			reject( new Error( 'Search and replace string should not be identical' ) );
		}

		const filePath = path.resolve( srcDir, filename );

		const filenameReplace = filename.replace( search, replace );
		const filePathReplace = path.resolve( ( destDir ? destDir : srcDir ), filenameReplace );
		let fsMethod;

		if ( copy === true )
		{
			fsMethod = 'copyFile';
		}
		else
		{
			fsMethod = 'rename';
		}

		fs[fsMethod]( filePath, filePathReplace, err =>
		{
			if ( err )
			{
				if ( log )
				{
					logStatus( 'error', 'Error renaming file' );
				}

				reject( err );
			}

			if ( log )
			{
				logStatus( 'success', 'Renamed file' );
			}

			resolve( filenameReplace );
		});
	});
}


// Exports
// ============================================================================

module.exports = renameSingleFile;
