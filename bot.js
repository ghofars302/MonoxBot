/* eslint-disable no-console */
const commando = require('discord.js-commando');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');
const config = require('./config/BotCfg.json');

const client = new commando.Client({
	owner: config.owner,
	commandPrefix: config.defaultPrefix,
	disableEveryone: true,
	unknownCommandResponse: false
});

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
		console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});

client.setProvider(
	sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

client.jimp = require('jimp');
client.ytdl = require('ytdl-core');
client.puppeteer = require('puppeteer');
client.isURL = function (value) {
	return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value);
};
client.getBufferFromJimp = async function (img, mime) {
	return new Promise((resolve, reject) => {
		img.getBuffer(mime || 'image/png', (err, buffer) => {
			if (err) reject(err);
			resolve(buffer);
		});
	});
};

client.registry
	.registerDefaultGroups()
	.registerGroups([
        ['util', 'util'],
				['image', 'image'],
				['']

    ])
  .registerDefaultTypes()
	.registerDefaultCommands({
     ping: false,
		 eval_: false,
		 commandState: false,
		 help: false
	 })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token);

process.on('unhandledRejection', (err) => {
	if (err.message && ['Missing Access', 'Missing Permissions'].some(x => err.message.includes(x))) return;
	console.error(`[ERROR] Unhandled rejection:\n${(err && err.stack) || err}`); // eslint-disable-line no-console
});
