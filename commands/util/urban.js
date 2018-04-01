const commando = require('discord.js-commando');
const urban = require('urban-dictionary');

class UrbanCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'urban',
			aliases: ['urban-dictionary'],
			group: 'util',
			memberName: 'urban',
			description: 'search shit meaning of your word',
			examples: ['Nothing here :D'],
		});
	}

  async run(msg, argString) {
    if (argString.length < 1 && !argString) {
      msg.channel.send(':warning: ``You must input a word``');
    } else {
      urban.term(argString, function (error, entries, tags) {
        if (error) {
          msg.channel.send({embed: {
            title: ":book: " + argString,
            fields: [{
              name: 'Definition:',
              value: 'No definition found. :('
            }],
            footer: {
              icon_url: 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA',
              text: 'Urban dictionary'
            }
          }})
        } else {
          var out = entries[0].definition;
          out.length > 1024 ? out = out.substring(0, 1024) : out;
          var ex = entries[0].example;
          ex.length > 1024 ? ex = ex.substring(0, 1024) : ex;
          if (!entries[0].example) {
            msg.channel.send({embed: {
              title: ':book: ' + entries[0].word,
              fields: [
                {
                  name: 'Definition',
                  value: out
                }
              ],
              footer: {
                icon_url: 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA',
                text: '👍 ' + entries[0].thumbs_up + ' 👎 ' + entries[0].thumbs_down +' | Urban Dictionary'
              }
            }});
          } else {
            msg.channel.send({embed: {
              title: ':book: ' + entries[0].word,
              fields: [
                {
                  name: 'Definition',
                  value: out
                },
                {
                  name: 'Example',
                  value: ex
                }
              ],
              footer: {
                icon_url: 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA',
                text: '👍 ' + entries[0].thumbs_up + ' 👎 ' + entries[0].thumbs_down +' | Urban Dictionary'
              }
            }});
          }
        };
      });
    };
  };
};

module.exports = UrbanCommand;
