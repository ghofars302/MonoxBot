const commando = require('discord.js-commando');
const { exec } = require('child_process');
const randomfact = [
  'No u',
  'adk',
  'NotSoSuper#0001',
  'Monodoxy Computer',
  'Glitch.com',
  'Myself?',
  'Shit',
  'FBI',
  'Google',
  'Some cunts',
  'Fuck off',
  'Ultra Nigger',
  'Nep nep',
  'Nepu nepu',
  'Kiss x sis',
  'Oreimo',
  'Anime',
  'Osu!',
  'mania?',
  'Circle clicker?',
  'Cancer',
  'Insert Funny fact here',
  'nigga',
  'nigger',
  'NotSoBot tags',
  'Nope',
  'Indonesian',
  'US VPN'
];

function isURL(value) {
	return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value);
}
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

class PingCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: [],
			group: 'util',
			memberName: 'ping',
			description: 'PING!!!!!',
			examples: ['Nothing here :D'],
			throttling: {
				usages: 1,
				duration: 1.5
			},
		});
	}

  async run(msg, argString) {
		const message = await msg.channel.send("Ok. Pinging...")
		async function output(error, stdout, stderr) {
			if (error) {
				message.edit(stderr, {code: "xl"});
			} else {
				message.edit(stdout, {code: "xl"});
			}
		}
		let msgExec = `ping -c 4 "` + argString + `"`;
		if (argString.length > 2 && isURL(argString)) {
			exec(msgExec, output);
		} else {
			message.edit('Pong! It took ``' + Math.round(this.client.ping) + 'ms`` to ping **' + randomItem(randomfact) + '**');
		}
  }
};

module.exports = PingCommand;
