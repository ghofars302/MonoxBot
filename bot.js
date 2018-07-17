const api = require('discord.js');
const config = require('./config/config.json');
const ResourceLoader = require('./const/ResourceLoader');
const messageHandler = require('./const/messageHandler');
const utils = require('./const/utils');
const Client = require('./const/Client');
const ConfirmHelper = require('./const/confirmationHelper');
const Paginate = require('./const/Paginate');
const Events = require('./const/events');
const logger = require('./modules/MonoxLogger');
const fAPI = require('./modules/fAPI');
const Context = require('./const/Context');

process.on('unhandledRejection', (err) => {
	if (err.message && ['Missing Access', 'Missing Permissions', 'Unknown Message'].some(x => err.message.includes(x))) return;
	console.error(`${'[ERR]'.red} Unhandled rejection:\n${(err && err.stack) || err}`); // eslint-disable-line no-console
});

class MonoxBot {
	constructor() {
		this.config = config;
		this.api = api;
		this.utils = utils;
		
		this.ResourceLoader = new ResourceLoader(this);
		this.messageHandler = new messageHandler(this);
		this.utils = new utils(this);
		this.ConfirmationHelper = new ConfirmHelper(this);
		this.Paginate = new Paginate(this);
		this.db = this.ResourceLoader.createDBInstance();
		this.logger = logger;
		
		this.client = new Client({
			disableEveryone: true,
			fetchAllMembers: true,
			messageCacheLifetime: 0,
			messageCacheMaxSize: 500,
			disableEvents: ['TYPING_START', 'PRESENCE_UPDATE'],
			WebsocketOptions: {
				compress: true
			},
			prefix: this.config.prefix,
			owner: this.config.admins
		}, this);
		
		new Events(this);

		this.fAPI = fAPI;
		this.context = new Context(this);

		this.ResourceLoader.loadModules();
		this.commands = this.ResourceLoader.loadCommands();
		
		this.commandCooldowns = new api.Collection();
		this.commandEditingStore = new api.Collection();
		this.songQueues = new api.Collection();
		this.voiceStreams = new api.Collection();
		this.playingSongs = new api.Collection();
		
		this.client.login(process.env.TOKEN);
	}
}

module.exports = new MonoxBot();