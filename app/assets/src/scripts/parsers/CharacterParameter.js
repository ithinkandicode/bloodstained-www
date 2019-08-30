function buildEnemiesObject( data )
{
	const strings = data.strings.Table;
	const archive = data.archive;
	const char = data.enemies;
	const charParams = data.enemyParams;

	console.log( strings );
	console.log( archive );
	console.log( char );
	console.log( charParams );

	const enemies = [];

	char.forEach( c =>
	{
		const id = c.Key;

		const enemyObject = {
			'path': '/Game/Core/Character/N3109/' + id,
		};
		console.log(c);

		enemies.push( enemyObject );
	});

	return null;
}

function buildEnemiesArray( ENEMIES )
{
	//
}

function displayTable( eenemyRows )
{
	//
}

async function enemiesInit( data )
{
	// Log fetched JSON
	console.log( data );

	if ( !data )
	{
		console.warn( 'JSON data was not supplied' );
		return;
	}

	const ENEMIES = buildEnemiesObject( data );
	const eenemyRows = buildEnemiesArray( ENEMIES );

	// displayCsv( artsRows );
	displayTable( eenemyRows );
}

export { enemiesInit };
