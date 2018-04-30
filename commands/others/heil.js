const MonoxCommand = require('../../const/MonoxCommand.js');

class Heil extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'heil',
			aliases: [],
			group: 'others',
			memberName: 'heil',
			description: 'HEIL HEIL HEIL',
			throttling: {
				usages: 1,
				duration: 10
			}
		})
	}
	
	async run(msg) {
    if (msg.author.id !== this.config.owner) return msg.channel.send('Yoo you think you can use this?');
		msg.channel.send('**Sieg Heil**', {files: [{name: 'hitler.png', attachment: 'http://i.dailymail.co.uk/i/pix/2014/03/05/article-2573831-1A09D794000005DC-976_634x547.jpg'}]})
	}
}

module.exports = Heil