const MonoxCommand = require('../../const/MonoxCommand.js');
const { exec } = require('child_process');
const randomfact = [
	'ping to ping to ping to ping to ping idk what i ping it.',
	'maybe you :V',
	'russian hacker',
	'u w0t m8?',
	'monox\'s computer',
	'monodoxy\'s computer',
	'MonoxBot relase',
	'lose try m!help for get all command list',
	'vote plz',
	'clicking circles lol',
	'i liek u',
	'undefined',
	'eval this.client.token',
	'insert funny message here',
	'do m!suggest for suggest feature',
	'myself?',
	'you xD',
	'new commands comming soon'
];

class PingCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: [],
			group: 'util',
			memberName: 'ping',
			description: 'PING!!!!!',
			throttling: {
				usages: 1,
				duration: 1.5
			}
		})
	}

	async run(msg, argString) {
		const message = await msg.channel.send("Ok. Pinging..."
		
		async function output(error, stdout, stderr) {
			if (error) {
				message.edit(stderr, {code: "xl"});
			} else {
				message.edit(stdout, {code: "xl"});
			}
		}
		
		let msgExec = `ping -c 4 "` + argString + `"`;
		
		if (argString.length > 2 && this.utils.isURL(argString)) {
			exec(msgExec, output);
		} else {
			message.edit('Pong! It took ``' + Math.round(this.client.ping) + 'ms`` to ping **' + this.randomItem(randomfact) + '**');
		}
	}
	
	randomItem(array) {
		return array[Math.floor(Math.random() * array.length)];
	}
};

module.exports = PingCommand;
