import { getData } from "./data/getData.js";
import { enemiesInit } from "./parsers/CharacterParameter.js";

const artsSources = [
	{
		name: 'strings',
		file: 'stringtable/PBMasterStringTable',
	},
	{
		name: 'archive',
		file: 'datatable/PB_DT_ArchiveArtsMaster',
	},
	{
		name: 'enemies',
		file: 'datatable/PB_DT_CharacterMaster',
	},
	{
		name: 'enemyParams',
		file: 'datatable/enemy/PB_DT_CharacterParameterMaster',
	},
];

async function init()
{
	const data = await getData( artsSources );

	enemiesInit( data );
}

init();