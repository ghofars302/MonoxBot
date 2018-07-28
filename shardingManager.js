require('dotenv').load();
const API = require('discord.js');
const SELF = require('./package.json');
const WEBHELPER = require('./http/app');
const PREPAREDB = require('./const/prepareDB');

const trueOrNot = process.env.webhelper === "true" ? true : false; // eslint-disable-line no-unneeded-ternary

/* eslint-disable no-console */

class MonoxSharding { // eslint-disable-line no-unused-vars
	constructor() {
		this.init();
	}

	init() {
		const shardManager = new API.ShardingManager('./bot.js', { // eslint-disable-line no-unused-vars
			token: process.env.TOKEN
		});

		console.log(`[SHARD M] [Module] discord.js ${API.version} loaded.`);
		console.log(`[SHARD M] [MonoxBot Framework] MonoxBot ${SELF['version']} launching... `);
	
		if (trueOrNot) {
			new WEBHELPER();
			console.log(`[SHARD M] [WEBHELPER] Initializing Webhelper API at port 3000`);
		} else {
			console.log(`[SHARD M] [WEBHELPER] [WARNING] Webhelper API is disabled.`);
		}

		shardManager.spawn();
		console.log(`[SHARD M] [MANAGER] Initializing ${shardManager.totalShards.toString()} shards about ${(isNaN(shardManager.totalShards) ? 0 : shardManager.totalShards - 1) * 7.5}s`)
	}
}

if (process.argv.includes('--prepare')) {
	console.log('[Shard M] [Database] Preparing Database...');

	PREPAREDB().then(() => {
		console.log('[Shard M] [Database] Database prepared! Now you can run this bot.');

		process.exit();
	}).catch((err) => { // eslint-disable-line newline-per-chained-call
		throw err;
	})
} else {
	new MonoxSharding();
}


