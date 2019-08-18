import { replaceCommandInputWithArrow } from "../replace/replaceCommandInputWithArrow.JS";
import { replaceBoolWithEmoji } from "../replace/replaceBoolWithEmoji.js";

/**
 * @typedef  ArtObject
 * @type     {object}
 * @property {string} id              ID (name in data tables)
 * @property {object} values          Original data values
 * @property {string} commandInputs   Array of button inputs
 * @property {string} commandCount    Number of button inputs
 * @property {object} states          Array of starting state bools
 * @property {bool}   states.walking  True if the art can be started from a standing position
 * @property {bool}   states.falling  True if the art can be started while in the air
 * @property {object} weapons         Weapons data object
 * @property {array}  weapons.list    Weapons data object
 * @property {string} weapons.type    Weapon category
 */

/**
 * Buld an object containing ArtObject items
 *
 * @param  {object} ARTSCOMMAND Original source object (from JSON)
 *
 * @return {array}             Array of ArtObject items, in the order listed in PB_DT_ArtsCommandMaster
 */
function buildArtsObject( ARTSCOMMAND, ARTSARCHIVE, STRINGTABLE )
{
	const ARTS = [];

	// temp stores
	const artsAddedTemp = [];
	let curUIndex = 0;

	ARTSCOMMAND.forEach( ART =>
	{
		let gameID = ART.Value.ID;
		const uID = gameID.replace( 'EWpnSPEntry::', '' );
		const isNew = ( !artsAddedTemp.includes( uID ) );

		// Art is unique so add it to ARTS
		if ( isNew )
		{
			// Flag that we've seenthis art already
			artsAddedTemp.push( uID );

			// Command
			const commandData = ART.Value.Command[0];
			const commandCount = commandData.length;
			const commandInputs = [];
			commandData.forEach( c => commandInputs.push( c.Key ) );

			// Weapon cat
			const weaponType = ART.Value.WeaponCategory.replace( 'EWeaponType::', '' );

			// States
			const states = {
				'walking': ( ART.Value.States.includes( "EArtsCommandStatus::Walking" ) ),
				'falling': ( ART.Value.States.includes( "EArtsCommandStatus::Falling" ) ),
			};

			// Archive lookup
			let archive = ARTSARCHIVE.find( arcItem => {
				return uID === arcItem.Value.ID.replace( 'EWpnSPEntry::', '' );
			});

			// dummy archive to prevent errors elsewhere
			if ( !archive )
			{
				archive = {
					Value: {
						Name        : '',
						Explanation : '',
						UnlockKey   : '',
					}
				};
			}

			// Lookup name from stringTable
			const niceName = STRINGTABLE.Table[archive.Value.Name];

			/**
			 * Custom Art object
			 *
			 * @type {ArtObject}
			 */
			const artObj = {
				'id': uID,
				'values': ART.Value,
				commandInputs,
				commandCount,
				'weapons': {
					list: [],
					type: weaponType
				},
				states,
				'archive': archive.Value,
				niceName,
			};

			// Add to ARTS
			ARTS.push( artObj );
		}

		const thisIndex = ( !isNew ) ? curUIndex - 1 : curUIndex;

		// This data's unique ARTS item
		const thisArt = ARTS[thisIndex];

		// Add weapon to ARTS item
		// Unless it ends with a number, to filter out 8bit upgrades
		const weaponId = ART.Value.WeaponId;
		const weaponIdLastChar = weaponId.charAt( weaponId.length - 1 );
		const intRegex = new RegExp( '[123]+' );
		const excludeWeapon = ( intRegex.test( weaponIdLastChar ) );

		if ( !excludeWeapon )
		{
			thisArt.weapons.list.push( ART.Value.WeaponId );
		}


		// Increase unique index
		if ( isNew )
		{
			curUIndex ++;
		}
	});

	// Make globally available
	window.ARTS = ARTS;

	return ARTS;
}

/**
 * Build an array of rows, for displaying a table
 *
 * @param  {ArtObject} ARTS  Custom arts objects
 *
 * @return {array}           Array of rows, including a headings row
 */
function buildArtsArray( ARTS )
{
	const rowsArr = [];

	// 11 cols
	const colHeadings = [
		'Key',
		'NiceName',
		'WeaponType',
		'CCount',
		'C1',
		'C2',
		'C3',
		'C4',
		'C5',
		'C6',

		'Btn1',
		'Btn2',
		'Btn3',
		'Btn4',
		'Btn5',
		'Btn6',

		'Walking',
		'Falling',

		'WalkingE',
		'FallingE',

		'WpnCount',
		'WpnList',

		'ITEM_NAME_',
		'ITEM_EXPLAIN_',
		'Archive_Unlock_'
	];

	rowsArr.push( colHeadings );

	ARTS.forEach( art =>
	{
		const { id, niceName, weapons, commandCount, commandInputs, states, archive } = art;

		//#TODO: Refactor into single function
		const c1 = ( commandInputs.length > 0 ) ? commandInputs[0] : '';
		const c2 = ( commandInputs.length > 1 ) ? commandInputs[1] : '';
		const c3 = ( commandInputs.length > 2 ) ? commandInputs[2] : '';
		const c4 = ( commandInputs.length > 3 ) ? commandInputs[3] : '';
		const c5 = ( commandInputs.length > 4 ) ? commandInputs[4] : '';
		const c6 = ( commandInputs.length > 5 ) ? commandInputs[5] : '';
		const btn1 = replaceCommandInputWithArrow(c1);
		const btn2 = replaceCommandInputWithArrow(c2);
		const btn3 = replaceCommandInputWithArrow(c3);
		const btn4 = replaceCommandInputWithArrow(c4);
		const btn5 = replaceCommandInputWithArrow(c5);
		const btn6 = replaceCommandInputWithArrow(c6);

		const weaponType  = weapons.type;
		const weaponCount = weapons.list.length;
		const weaponLinks = [];

		// Make weapons link to items page
		weapons.list.forEach( wpnId => weaponLinks.push( `<a href="/items.html#${wpnId}">${wpnId}</a>` ) );

		const row = [
			id,
			niceName,
			weaponType,
			commandCount,
			c1.replace( 'Attack', '<strong>A</strong>' ), //#todo: no hax pls
			c2.replace( 'Attack', '<strong>A</strong>' ),
			c3.replace( 'Attack', '<strong>A</strong>' ),
			c4.replace( 'Attack', '<strong>A</strong>' ),
			c5.replace( 'Attack', '<strong>A</strong>' ),
			c6.replace( 'Attack', '<strong>A</strong>' ),
			btn1,
			btn2,
			btn3,
			btn4,
			btn5,
			btn6,
			states.walking,
			states.falling,
			replaceBoolWithEmoji(states.walking),
			replaceBoolWithEmoji(states.falling),
			weaponCount,
			weaponLinks.join( ', ' ),

			archive.Name.replace( 'ITEM_NAME_', '' ),
			archive.Explanation.replace( 'ITEM_EXPLAIN_', '' ),
			archive.UnlockKey.replace( 'Archive_Unlock_', '' ),
		];

		rowsArr.push( row );
	});

	return rowsArr;
}

function generateHtmlTable( csvArr, useHeading = true )
{
	const theadRows = [];
	const tbodyRows = [];

	// Loop through rows
	csvArr.forEach( ( cols, rowIndex ) =>
	{
		const rowCols = [];

		const isFirstRow = ( useHeading && rowIndex === 0 );
		const cellEl  = ( isFirstRow ) ? 'th' : 'td';
		const rowsArr = ( isFirstRow ) ? theadRows : tbodyRows;

		const rowKey = cols[0];

		// Loop through columns
		cols.forEach( col =>
		{
			rowCols.push( `<${cellEl}>${col}</${cellEl}>` );
		});

		rowsArr.push( `<tr id="${rowKey}">`, rowCols.join( '' ), '</tr>' );
	});

	const tableHtml = `
		<table>
			<thead>
				${theadRows.join( '' )}
			</thead>
			<tbody>
				${tbodyRows.join( '\n' )}
			</tbody>
		</table>
	`;

	return tableHtml;
}

/*
function displayCsv( artsRows )
{
	// Display CSV
	const csvStr = artsRows.join( '\n' );
	const preCls = '.code-halfpage';
	const preEl = document.querySelector( preCls );

	if ( preEl )
	{
		preEl.innerText = csvStr.replace( /,/g, '\t' );
	}
	else
	{
		console.warn( 'No element with selector:', preCls );
	}
}
*/

function displayTable( artsRows )
{
	// Build table
	const tableHtml = generateHtmlTable( artsRows, true );

	document.querySelector( '.table-container' ).innerHTML = tableHtml;
}

async function artsInit( data )
{
	// Log fetched JSON
	console.log( data );

	if ( !data )
	{
		console.warn( 'JSON data was not supplied' );
		return;
	}

	const ARTS = buildArtsObject( data.command, data.archive, data.strings );
	const artsRows = buildArtsArray( ARTS );

	// displayCsv( artsRows );
	displayTable( artsRows );
}

// init();
// console.log( window.ARTS[0] );


export { artsInit };
