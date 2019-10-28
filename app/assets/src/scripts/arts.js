import { getData } from "./data/getData.js";
import { artsInit } from "./parsers/ArtsCommand.js";

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
		name: 'command',
		file: 'datatable/PB_DT_ArtsCommandMaster',
	},
];

async function init()
{
	const data = await getData( artsSources );

	artsInit( data );
}

init();