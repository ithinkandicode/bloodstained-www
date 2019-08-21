/*
 * Bulk rename .hca files
 *
 * CLI:
 *   node hca-rename.js <src> <dest> [<extension>]
 *
 * Example:
 *   Src:  "C:\temp\rename"
 *   Dest: "C:\temp\rename\out"
 *   Ext:  ".hca"
 *
 *   node hca-rename.js "C:\temp\rename" "C:\temp\rename\out"
 */


// Dependancies
// ============================================================================

// Utils
const logStatus = require('./utils/log/logStatus');
const logBreak = require('./utils/log/logBreak');
const renameFiles = require('./utils/file/renameFiles');
const checkPath = require('./utils/file/checkPath');


// Functions
// ============================================================================

async function hcadir()
{
	logBreak();

	const args = process.argv;

	if (args.length < 3)
	{
		logStatus( 'error', 'Missing first argument: Input directory' );
		return;
	}

	if (args.length < 4)
	{
		logStatus( 'error', 'Missing second argument: Output directory' );
		return;
	}

	//#TODO: Verify paths exists
	const srcDir  = process.argv[2];
	const destDir = process.argv[3];
	const ext     = process.argv[4] || '.hca';

	try
	{
		await checkPath( srcDir, true, true );
		await checkPath( destDir, true, true );
	}
	catch( err )
	{
		logStatus( 'error', 'One of the supplied paths does not exist. Tried to create this path, but failed' );
		return;
	}

	try {
		logBreak();
		logStatus( 'info', 'Starting rename...' );
		logBreak();

		const search  = '00000000';
		const replace = 'XXXXXXXX';

		const counts = await renameFiles( search, replace, srcDir, destDir, ext, null, true, true );

		logBreak();
		logStatus( 'misc', `Renamed: ${counts.renamed}, Unchanged: ${counts.unchanged}, Ignored: ${counts.ignored}` );
		logBreak();
		logStatus( 'success', 'Done' );
	}
	catch( err )
	{
		logStatus( 'error', err );
	}
}


// CLI Init
// ============================================================================

// If run from command line
if ( require.main === module )
{
	try
	{
		hcadir();
	}
	catch ( err )
	{
		logStatus( 'error', err );
	}
}
