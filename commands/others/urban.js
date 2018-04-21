const MonoxCommand = require('../../const/MonoxCommand.js');
const { MessageEmbed } = require('discord.js');

class UrbanCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'urban',
			aliases: ['webdict'],
			group: 'others',
			memberName: 'urban',
			description: 'Get meaning of words from urban dictionary.',
			throttling: {
				usages: 1,
				duration: 1.5
			}
		})
	}
	
	async run(msg, argString) {
		if (!argString) return this.utils.infoTextBlock(msg, 'm!urban (words)', 'Get meaning of word from urban dictionary.');
		this.webdict.term(argString, function(error, entries) {
			if (error) {
				msg.channel.send(':warning: ``No result found.``');
			} else {
				let definition = entries[0].definition;
				definition.length > 1024  ? definition = definition.substring(0, 1024) : definition;
				let example = entries[0].example;
				example.length > 1024  ? example = example.substring(0, 1024) : example;
				let example2 = entries[1].example;
				example2.length > 1024  ? example2 = example2.substring(0, 1024) : example2;
				
				if (!entries[0].example && entries[1].example) {
					const embed = new MessageEmbed();
					embed.setTitle(entries[0].word)
						.setURL(entries[0].permalink)
						.addField('Definition', definition)
						.setFooter('Urban Dictionary || 👍 ' + entries[0].thumbs_up + ' 👎 ' + entries[0].thumbs_down, 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA');
					msg.channel.send(embed);
				} else if (!entries[1].example){
					const embed = new MessageEmbed();
					embed.setTitle(entries[0].word)
						.setURL(entries[0].permalink)
						.addField('Definition', definition)
						.addField('Example', example)
						.setFooter('Urban Dictionary || 👍 ' + entries[0].thumbs_up + ' 👎 ' + entries[0].thumbs_down, 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA');
					msg.channel.send(embed);					
				} else {
					const embed = new MessageEmbed();
					embed.setTitle(entries[0].word)
						.setURL(entries[0].permalink)
						.addField('Definition', definition)
						.addField('Example 1', example2)
						.addField('Example 2', example2)
						.setFooter('Urban Dictionary || 👍 ' + entries[0].thumbs_up + ' 👎 ' + entries[0].thumbs_down, 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA');
					msg.channel.send(embed);					
				}
			}
		})
	}
}

module.exports = UrbanCommand;