/**
 * Fetch JSON and return it. Optionally log the data
 *
 * @param   {string}  url  Full URL to fetch from
 * @param   {bool}    log  True to logt the retreived data
 *
 * @return  {Promise}      Resolved promise containing data. On error, rejected promise containing error object
 */
function fetchJson( url, log = false )
{
	return new Promise( ( resolve, reject ) =>
	{
		try
		{
			if ( !url || typeof url !== 'string' )
			{
				throw new Error( 'DEV_ERROR: Fetch URL was empty or not a string: ' + url );
			}

			fetch( url ).then( response =>
			{
				if ( response.status !== 200 )
				{
					throw new Error( `Response was ${response.status} but should be 200, for url: ` + url );
				}

				response.json().then( data =>
				{
					if ( log )
					{
						console.log( data );
					}

					resolve( data );
				});
			});
		}
		catch( err )
		{
			console.error( 'Error retrieving JSON:' );
			console.error( err );
			reject();
		}
	});
};

export { fetchJson };