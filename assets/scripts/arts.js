import { getData } from "./data/getData.js";
import { artsInit } from "./parsers/ArtsCommand.js";

const artsSources = [
	{
		name: 'command',
		file: 'datatable/PB_DT_ArtsCommandMaster',
	},
	{
		name: 'archive',
		file: 'datatable/PB_DT_ArchiveArtsMaster',
	},
	{
		name: 'strings',
		file: 'stringtable/PBMasterStringTable',
	},
];

async function init()
{
	const data = await getData( artsSources );

	artsInit( data );
}

init();