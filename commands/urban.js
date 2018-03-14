exports.run = async (client, message, args, level) => {
    const msg = await message.channel.send('Searching...')
    try {
      const search = args.join(" ");
      const urban = require('urban-dictionary');
      if(!search) return msg.edit('You must provide the text.');
      urban.term(search, function (error, entries, tags, sounds) {
        if (error) {
          msg.edit({embed: {
            title: ":book: " + search,
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
          var out = entries[0].definition;
          out.length > 1024 ? out = out.substring(0, 1024) : out;
          var ex = entries[0].example;
          ex.length > 1024 ? ex = ex.substring(0, 1024) : out;
          if(!entries[0].example) return msg.edit({embed: {
            title: ":book: " + entries[0].word,
            fields: [{
              name: 'Results',
              value: out
            }],
            footer: {
              icon_url: 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA',
              text: '👍 ' + entries[0].thumbs_up + ' 👎 ' + entries[0].thumbs_down +' Urban Dictionary'
            }
          }});
          msg.edit({embed: {
            title: ":book: " + entries[0].word,
            fields: [{
              name: 'Results',
              value: out
            },
            {
              name: 'Example',
              value: ex
            }
            ],
            footer: {
              icon_url: 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA',
              text: '👍 ' + entries[0].thumbs_up + ' 👎 ' + entries[0].thumbs_down + ' Urban Dictionary'
            }
          }})
        };
      });
    } catch (err) {
      msg.edit(':warning: Urban Dictionary API down!');
      console.error(err);
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['dictionary'],
  permLevel: "Users"
};

exports.help = {
  name: "urban",
  category: "Unity",
  description: "Get meaning of word from urbandictionary.com",
  usage: "urban (word)"
};
