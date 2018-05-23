const MonoxCommand = require('../../const/MonoxCommand.js');

class UrbanCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'urban',
			aliases: ['webdict'],
			group: 'others',
			memberName: 'urban',
			description: 'Get meaning of words from urban dictionary.',
			examples: ['(Query....)'],
			throttling: {
				usages: 1,
				duration: 1.5
			}
		})
	}
	
	async run(msg, args) {
		if (!args) return this.utils.invalidArgument(msg);
		let term = encodeURIComponent(args);
		let fetched = await this.fetch(`http://api.urbandictionary.com/v0/define?term=${term}`);
		let json = await fetched.json();
		let define = json.list;
		if (!Object.keys(json.list).length) {
            return msg.channel.send(':warning: ``No result found.``');
		}

		if (!define[0].example) {
			await msg.channel.send({embed: {
				title: define[0].word,
				url: define[0].permalink,
				fields: [{
					name: 'Definition',
					value: define[0].definition
				}],
				footer: {
					text: 'Urban Dictionary || 👍 ' + define[0].thumbs_up + ' 👎 ' + define[0].thumbs_down,
					icon_url: 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA'
				}
			}})
		} else {
			await msg.channel.send({embed: {
				title: define[0].word,
				url: define[0].permalink,
				fields: [{
					name: 'Definition',
					value: define[0].definition
				},
				{
					name: 'Example',
					value: define[0].example
				}],
				footer: {
					text: 'Urban Dictionary || 👍 ' + define[0].thumbs_up + ' 👎 ' + define[0].thumbs_down,
					icon_url: 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA'
				}
			}})			
		}
	}
}

module.exports = UrbanCommand;