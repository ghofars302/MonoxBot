const fs = require('fs');
const path = require('path');
const humanizeDuration = require('humanize-duration');
const postgres = require('pg'); 
const _ = require('lodash');

class ResourceLoader {
	constructor(bot) {
		this.bot = bot;
	}
	
	loadCommands() {
		const commands = new this.bot.api.Collection();

		const loadCommandsIn = (dir) => {
			for (const subName of fs.readdirSync(dir)) {
				if (fs.statSync(path.resolve(dir, subName)).isDirectory()) {
					loadCommandsIn(path.resolve(dir, subName));
				} else {
					let file = path.resolve(dir, subName);
					let name = subName.substring(0, subName.lastIndexOf('.')).toLowerCase();

					if (require.cache[require.resolve(file)]) delete require.cache[require.resolve(file)];

					const command = require(file);
					command.name = name;
					commands.set(name, command);

					if (command.aliases)
						for (const alias of command.aliases)
							commands.set(alias, {
								alias: true,
								name: name
							});
				}
			}
		};

		loadCommandsIn('./commands/');

		return commands;
	}
	
	loadModules() {
		this.bot.gm = require('gm').subClass({imageMagick: true});
		this.bot.fetch = require('node-fetch');
		this.bot.fs = require('fs');
		this.bot.childProcess = require('child_process');
		this.bot.axios = require('axios');
		this.bot.hd = humanizeDuration.humanizer({
			languages: {
				youtube: {
					m: () => 'm',
					s: () => 's'
				}
			}
		});
		this.bot.util = require('util');
		this.bot.rpromise = require('request-promise');
		this.bot.nekosapi = require('../modules/nekosAPI');
		this.bot.fetchapi = require('../modules/fetchAPI');
		this.bot.fAPI = require('../modules/fAPI');
		this.bot.logger = require('../modules/MonoxLogger');

		/* Global Object */

		global.fetch = this.bot.fetch;
		global.fs = this.bot.fs;
	}

	createDBInstance() {
		return new postgres.Pool({
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			max: 1,
			idleTimeoutMillis: 30000
		});
	}

	generateHelpPages() {
		const sorted = {};
		let key;
		const a = [];

		this.commandsObj = {};

		this.bot.commands.forEach((value, key) => {
			if (!value.alias) this.commandsObj[key] = value;
		})

		_.forEach(this.commandsObj, (value, key) => {
			a.push(key)
		});

		a.sort();

		this.bot.helpPages = [];

		for (key = 0; key < a.length; key++) {
			sorted[a[key]] = this.commandsObj[a[key]];
		}

		this.commands = sorted;

		let iterate = 0;
		let helpPageCount = 1;

		let output = '';

		_.forEach(this.commands, (command) => {
			output += `- ${command.name}`;

			if (command.aliases) {
				if (Array.isArray(command.aliases)) {
					output += ` [${command.aliases.join(' | ')}]`;
				} else {
					output += ` [${command.aliases}]`;
				}
			}

			if (command.description) {
				output += `\n     --- ${command.description}\n`;
			}

			this.bot.helpPages[helpPageCount - 1] = output;

			iterate += 1;

			if (iterate >= 10) {
				helpPageCount += 1;
				iterate = 0;
				output = '';
			}
		})
	}
}

module.exports = ResourceLoader;
