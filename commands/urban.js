exports.run = async (client, message, args, level) => {
    const msg = await message.channel.send('Searching...')
    try {
      const search = args.join(" ");
      const urban = require('urban-dictionary');
      if(!search) return msg.edit('You must provide the text.');
      urban.term(search, function (error, entries, tags, sounds) {
        if (error) {
          msg.edit({embed: {
            title: ":book: " + entries[0].word,
            fields: [{
              name: 'Results',
              value: 'No Results found. :(',
            }],
            footer: {
              icon_url: 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA',
              text: 'Urban Dictionary'
            }
          }});
        } else {
          if(!entries[0].example) return msg.edit({embed: {
            title: ":book: " + entries[0].word,
            fields: [{
              name: 'Results',
              value: entries[0].definition,
            }],
            footer: {
              icon_url: 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA',
              text: 'Urban Dictionary'
            }
          }});
          msg.edit({embed: {
            title: ":book: " + entries[0].word,
            fields: [{
              name: 'Results',
              value: entries[0].definition,
            },
            {
              name: 'Example',
              value: entries[0].example
            }
            ],
            footer: {
              icon_url: 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA',
              text: 'Urban Dictionary'
            }
          }})
        };
      });
    } catch (err) {
      msg.edit(':warning: Urban.js API down!');
      console.error(err);
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['dictionary'],
  permLevel: "User"
};

exports.help = {
  name: "urban",
  category: "Unity",
  description: "Get meaning of word from urbandictionary.com",
  usage: "urban (word)"
};
