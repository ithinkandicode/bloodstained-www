import { getData } from "./data/getData.js";

const PBD = (function() {
	return {

		/**
		 * Store for fetched data
		 */
		data: {},

		init: async function()
		{
			const sources = [
				{
					name: 'items',
					file: 'datatable/PB_DT_ItemMaster',
				},
				{
					name: 'strings',
					file: 'stringtable/PBMasterStringTable',
				},
				{
					name: 'heal',
					file: 'datatable/PB_DT_SpecialEffectDefinitionMaster',
				}
			];

			const data = await getData( sources, true );

			// Save data to this object's scope
			this.data = data;

			this.whenDataReady( data );
		},

		whenDataReady: function( data )
		{
			this.createTable( data );
		},

		whenMarkupReady: function()
		{
			this.addLoadedClass();
			this.toggleBtns();

			this.scrollToRow();
		},

		scrollToRow: function()
		{
			const hash = window.location.hash;

			if ( hash && hash !== '' )
			{
				const rowId = hash.substring( 1, hash.length );
				const rowEl = document.getElementById( rowId );

				// Check if page was reloaded
				// Page reloads take you to the last position, so scrollIntoView is ignored
				const pageWasReloaded = ( window.performance && performance.navigation.type === 1 ) ? true : false;

				if ( rowEl && !pageWasReloaded )
				{
					rowEl.scrollIntoView();

					// Scroll up a little, to account for sticky header
					window.scrollBy( 0, -50 );

					rowEl.classList.add( 'row-scrolled-into-view' );
				}
			}
		},

		addLoadedClass: function()
		{
			document.querySelector( 'body' ).classList.add( 'loaded' );
		},

		/**
		 * [getStringByKey description]
		 *
		 * @param   {string}         key   Lookup key
		 *
		 * @return  {string|boolean}       String on successful lookup. False bool it lookup failed
		 */
		getStringByKey( key, logWarning = false )
		{
			const stringTable = this.data.strings.Table;

			if ( key && stringTable.hasOwnProperty( key ) )
			{
				return stringTable[key];
			}
			else
			{
				if ( logWarning )
				{
					console.warn( 'Tried to search string table but used an invalid key:', key );
				}

				return false;
			}
		},

		/**
		 * Quick and dirty fix to split shards and items across two pages
		 *
		 * @return  {Object}  Object contianing page vars. Atm this is just
		 */
		getPageVars: function()
		{
			if ( !window.PBVARS )
			{
				console.error( 'Need to define window.PBVARS' );
			}
			else
			{
				return window.PBVARS;
			}
		},

		allowType: function( type )
		{
			if ( !type )
			{
				console.error( '[allowType] Type was not defined' );
			}

			const currentType = this.getPageVars().currentType;

			if ( currentType === 'all' )
			{
				return true;
			}

			const types = {
				items: [
					'Type',
					'Potion',
					'Ingredient',
					'None',
					'Book',
					'FoodStuff',
					'Food',
					'Seed',
					'Key',
					'Ingredient',
				],
				weaponsArmor: [
					'Weapon',
					'Head',
					'Muffler',
					'Accessory',
					'Body',
					'Bullet',
				],
				shards: [
					'TriggerShard',
					'EffectiveShard',
					'DirectionalShard',
					'EnchantShard',
					'FamiliarShard',
					'Skill'
				],
				none: [
					'None'
				]
			};

			console.log( types[currentType] );

			return types[currentType].includes( type );
		},

		/**
		 * Create an HTML table using supplied data
		 *
		 * #TODO: Pass data to another function to add to page,
		 * this one does too much
		 *
		 * @param   {object}  data         Data object
		 * @param   {object}  data.items   Items  - PB_DT_ItemMaster
		 * @param   {object}  data.strings String - PBMasterStringTable
		 *
		 * @return  {void}
		 */
		createTable: function( data )
		{
			const tableRows = [];

			// #todo use array loop
			const tableHeadings = `
				<thead>
					<tr>
						<th class="item-icon">Icon</th>
						<th class="item-icon-id">IconId</th>
						<th class="item-index">Index</th>

						<th class="item-name">Name</th>
						<th class="item-id">ID</th>
						<th class="item-type">Type</th>

						<th class="item-heal">Heal</th>

						<th class="item-max">Max</th>

						<th class="item-shop">Buy</th>
						<th class="item-shop">Sell</th>

						<th class="item-bools" title="Carry to New Game Plus (!NotInheritable)">NG+</th>
						<th class="item-bools" title="Carry to Boss Rush (CarryToBossRushMode)">BR</th>
						<th class="item-bools" title="Listed in the Archive (!NotListedInArchive)">Arc</th>
						<th class="item-bools" title="Required for Completion (!NotCountAsCompleteness)">Req</th>

						<th class="item-info">Info</th>
					</tr>
				</thead>
			`;

			// Loop through the items
			data.items.forEach( ( item, index ) =>
			{
				const ID = item.Key;
				const {
					IconPath,
					ItemType,
					NameStrKey,
					DescriptionStrKey,
					max,
					buyPrice,
					sellPrice,
					CarryToBossRushMode,
					NotInheritable,
					NotListedInArchive,
					NotCountAsCompleteness } = item.Value;

				/**
				 * Array of table cells markup for this row
				 *
				 * @var  {array}
				 */
				let rowCells = [];


				// Types
				// Type is checked first, against page vars

				// Get the item type (Potion, Ingredient, etc)
				let type = ItemType.replace( 'ECarriedCatalog::', '' );
				let niceType = type; // Store original type

				// Remove integer affix from accessory
				niceType = ( niceType === 'Accessory1' ) ? 'Accessory' : niceType;

				// Only show row3s that match the type
				//@TODO super hacky fix and horrible unperfomant. you can tell it's getting late ;)

				if ( !this.allowType( niceType ) )
				{
					return;
				}


				// Name

				// Actual name, and archive info
				// const stringName = data.strings.Table[NameStrKey];
				const stringName = ( NameStrKey ) ? this.getStringByKey( NameStrKey ) || ID : ID;


				// Icon

				// Check for icon, and make it 3 digits
				let iconEl = '';
				if ( IconPath !== '0' )
				{
					const iconIndex = ( IconPath.length < 3 ) ? '0' + IconPath : IconPath;

					iconEl = `<img class="item-icon-img" src="/assets/images/items/${iconIndex}.png" alt="${stringName}">`;
				}

				rowCells.push(`
					<!-- Icons & IDs -->
					<td class="item-icon item-icon-cell">
						<div class="item-icon-zoom">
							${iconEl}
						</div>
						<div class="item-icon-img-container">
							${iconEl}
						</div>
					</td>
					<td class="item-icon-id text-mono">${IconPath || ''}</td>
					<td class="item-index text-mono">${index}</td>
				`);


				// Type

				rowCells.push(`
					<!-- Name & Type -->
					<td class="item-name">${stringName}</td>
					<td class="item-id">${ID}</td>
					<td class="item-type">${niceType}</td>
				`);



				// Healing

				let healValue = '';
				const healData = data.heal.find( ( item => item.Key === ID ) );

				// Weird data for SwordMastery. Mistake in the source data?
				//#TODO: Add toggle to handle outliers
				if ( healData && ID !== 'SwordMastery' )
				{
					healValue = ( healData.Value.Parameter01 > 0 ) ? healData.Value.Parameter01 : '';
				}

				rowCells.push(`
					<!-- Heal -->
					<td class="item-heal text-right text-mono">${healValue}</td>
				`);

				rowCells.push(`
					<!-- Max -->
					<td class="item-max text-right text-mono">${max || ''}</td>
				`);

				rowCells.push(`
					<!-- Shop -->
					<td class="item-shop text-right text-mono">${buyPrice || ''}</td>
					<td class="item-shop text-right text-mono">${sellPrice || ''}</td>
				`);



				// Booleans

				// Note: Some bools are flipped for visual clarity
				const bools = {
					carryToBossRush:       CarryToBossRushMode,
					carryToNewGamePlus:    !NotInheritable,
					requiredForCompletion: !NotCountAsCompleteness,
					listedInArchive:       !NotListedInArchive
				};


				const boolColumns = [];

				// Generate columns (td) for each bool
				Object.keys( bools ).forEach( boolKey =>
				{
					const boolValue = bools[boolKey];
					const boolCls   = ( boolValue ) ? 'true' : 'false';
					const boolEmoji = ( boolValue ) ? '✔️'   : '❌';

					const boolCol = `
						<td class="item-bools text-center bool-bg-${boolCls}">
							<span class="bool-emoji">${boolEmoji}</span>
						</td>`;

					boolColumns.push( boolCol );
				});

				// console.log(boolColumns);

				// Join columns and push to main rows array
				rowCells.push( '<!-- Bools -->' );
				rowCells.push( boolColumns.join( '\n' ) );


				// Description
				const stringExplain = data.strings.Table[DescriptionStrKey];

				let info = ( stringExplain ) ? stringExplain.replace( '\n', '<br>' ) : '';

				// Replace <input> strings
				if ( info.length && info.includes( 'input' ) )
				{
					info = info.replace( /<input id="([A-z0-9]*)"\/>/g, "<code>$1</code>" );
				}

				rowCells.push( `
					<!-- Description -->
					<td class="item-info has-toggle-br">${info}</td>
				`);

				const rowOpen  = `<tr id="${ID}" class="item-row item-type-${niceType}">`;
				const rowClose = '</tr>';

				tableRows.push( rowOpen, rowCells.join( '\n' ), rowClose );
			});



			const tableMarkup = `
				<table>
					${tableHeadings}
					<tbody>
						${tableRows.join( '\n\t\t\t\t\t' )}
					</tbody>
				</table>
			`;

			const target = document.querySelector( '.lookup-item' );

			target.innerHTML = tableMarkup;

			this.whenMarkupReady();
		},

		imageToggleBtn: function()
		{
			document.querySelector( '.js-image-toggle' ).addEventListener( 'click', () =>
			{
				const imageIcons = document.querySelectorAll( '.item-icon' );

				imageIcons.forEach( el => el.classList.toggle( 'hide' ) );
			});
		},

		toggleBtns: function()
		{
			const toggleBtns = document.querySelectorAll( '[data-toggle]' );

			if ( !toggleBtns )
			{
				return;
			}

			toggleBtns.forEach( btn =>
			{
				btn.addEventListener( 'click', ( ) =>
				{
					// State class
					btn.classList.toggle( 'toggle-btn-state--inactive' );
					btn.classList.toggle( 'toggle-btn-state--active' );

					// Body toggle class
					const bodyCls = btn.getAttribute( 'data-toggle' );

					// Special cases

					if ( bodyCls === 'toggle-all-types' )
					{
						// Click all type toggles
						// Quick and dirty until toggles are proerly refactored
						document.querySelectorAll( '[data-toggle-type]' ).forEach( btn => btn.click() );
					}
					else if ( bodyCls === 'show-type' )
					{
						const typeTarget = btn.getAttribute( 'data-toggle-type' );
						const typeTargetCls = 'item-type-' + typeTarget;

						// console.log(typeTarget, typeTargetCls);

						const targets = document.querySelectorAll( '.' + typeTargetCls );

						targets.forEach( typeRow =>
						{
							typeRow.classList.toggle( 'hide' );
						});
					}
					else
					{
						document.querySelector( 'body' ).classList.toggle( bodyCls );
					}
				});
			});
		},


		/**
		 * Icon Zoom  - Unfinished, used css instead
		 */
		/*
		itemIconZoom: function()
		{
			// on image hover
			const iconCells = document.querySelectorAll( '.js-item-icon-cell' );

			iconCells.forEach( iconCell =>
			{
				iconCell.addEventListener( 'onmouseover', () =>
				{
					const img = iconCell.querySelector( '.item-icon-img' );

					if ( !img ) {
						return;
					}

					const zoomContainer = iconCell.querySelector( 'item-icon-zoom' );

					zoomContainer.classList.add( 'show-block' );
				});
			});
		}
		*/



		/*
		Full type list. Note ingredient appears twice

		Type
		Potion
		Ingredient
		None
		Weapon
		Head
		Muffler
		Accessory1
		Body
		FoodStuff
		Food
		Seed
		Key
		Book
		Bullet
		Ingredient
		TriggerShard
		EffectiveShard
		DirectionalShard
		EnchantShard
		FamiliarShard
		Skill
		*/
	};
})();

PBD.init();

