
// Dependancies
// ============================================================================

// Native
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Utils
const logStatus = require('../log/logStatus');
const getFilesList = require('./getFilesList');
const renameSingleFile = require('./renameSingleFile');


// Constants
// ============================================================================

// Promisify
const statPromise = promisify( fs.stat );


// Functions
// ============================================================================

/**
 * Rename files in the given directory.
 *
 * Doesn't rename directories.
 * Doesn't check subdirectories.
 *
 * @async
 * @param   {string}   srcDir          Source directory
 * @param   {string}   [destDir]       Destination directory
 * @param   {string}   [ext=null]      File extension to match against. If not set, renames all files
 * @param   {Boolean}  [copy=true]     True to copy files, false to move them. Set to false to delete the orignal files after renaming them
 * @param   {Boolean}  [log=false]     True to log data
 * @return  {Promise.<RenameCounts>}   Resolves with the object of action counts (renamed, unchanged, ignored). Rejects with an error object
 */
async function renameFiles( search, replace, srcDir, destDir, ext, copy = true, log = false )
{
	return new Promise( async (resolve, reject) =>
	{
		let filesList;

		// Get a list of files within the target directory
		try
		{
			filesList = await getFilesList( srcDir );
		}
		catch( err )
		{
			if ( log )
			{
				logStatus( 'error', 'An error occured when reading the files list' );
			}

			reject( err );
		}

		/**
		 * Rename counts object
		 *
		 * @typedef  {Object} RenameCounts
		 *
		 * @property {Number} renamed   Number of files renamed
		 * @property {Number} unchanged Number of files unchanged
		 * @property {Number} ignored   Number of files ignored
		 */

		/**
		 * Rename counts object
		 *
		 * @type {RenameCounts}
		 */
		let counts = {
			renamed:   0,
			unchanged: 0,
			ignored:   0,
		};

		// Iterate over each file and rename them
		for ( const filename of filesList )
		{
			// Is this a file, or a directory?
			const filePath = path.resolve( srcDir + '\\' + filename );
			const fileStat = await statPromise( filePath );
			const isDir = fileStat.isDirectory();

			if ( isDir )
			{
				return;
			}

			// Rename all files if no extension was specified
			let renameFile = ( !ext ) ? true : false;

			if ( ext )
			{
				renameFile = new RegExp( '\.' + ext ).test( filename );
			}

			// Only rename pattern-matched files
			if ( renameFile )
			{
				try
				{
					const filenameRenamed = await renameSingleFile( filename, search, replace, srcDir, destDir, copy, false );

					// Did the filename change?
					if ( filename !== filenameRenamed )
					{
						if ( log )
						{
							logStatus( 'misc', `Renamed:   ${filename} > ${filenameRenamed}` );
						}

						counts.renamed ++;
					}
					else
					{
						if ( log )
						{
							logStatus( 'misc', 'Unchanged: ' + filename );
						}

						counts.unchanged ++;
					}
				}
				catch( err )
				{
					if ( log )
					{
						logStatus( 'error', `Error renaming file: "${filename}"` );
					}

					reject( err );
				}
			}
			else
			{
				if ( log )
				{
					logStatus( 'misc', 'Ignored: ' + filename );
				}

				counts.ignored ++;
			}
		}

		resolve( counts );
	});
}


// Exports
// ============================================================================

module.exports = renameFiles;
