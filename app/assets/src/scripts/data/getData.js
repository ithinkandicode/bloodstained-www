import { fetchJson } from "./fetchJson.js";

/**
 * @typedef  SourceObject
 * @type     {object}
 * @property {string} name ID (name in data tables)
 * @property {string} file JSON file path. Starts from /assets/json/. Exclude ".json"
 */

/**
 * Asynchrously load an array of data sources
 *
 * @async
 *
 * @param   {array.<SourceObject>}  sources  Array of objects containing data source (name) and filepath (file)
 * @param   {object}                log      True to log the data
 *
 * @return  {object}                         Object containing data. Keys are the source names. On error returns false bool
 */
async function getData( sources = [], log = false )
{
	try
	{
		// Temp store for promises
		const fetchPromises = [];

		// Store for the object we'll pass to `whenDataReady`
		const data = {};

		// Start fetch promises
		sources.forEach( source => fetchPromises.push( fetchJson( `/assets/json/${source.file}.json`, false ) ) );

		// Wait for all promises to resolve
		const responses = await Promise.all( fetchPromises );

		// Set source names as data keys
		sources.forEach( ( source, sourceIndex ) => data[source.name] = responses[sourceIndex] );

		if ( log )
		{

			console.log( data );
		}

		return data;
	}
	catch( err )
	{
		console.error( 'Error during data setup:' );
		console.error( err );

		return false;
	}
}

export { getData };
