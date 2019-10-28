function replaceBoolWithEmoji( bool )
{
	let emoji = '';

	switch ( String( bool ).toUpperCase() )
	{
		case 'TRUE':
			emoji = '️️️✔️';
			break;

		case 'FALSE':
			emoji = '️❌';
			break;
	}

	return emoji;
}

export { replaceBoolWithEmoji };
