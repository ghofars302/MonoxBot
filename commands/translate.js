const translate = require('google-translate-api-plus');
const lang = 'net';
const stripIndents = require('common-tags').stripIndents;

exports.run = async (client, message, args, level) => {
  if(!args || args.length < 2) return message.channel.send('You must input text for translate!');
  let inputLang = args[0];
  let inputText = args[1].join(' ');
  const msg = await message.channel.send('Translating..');
  let res;
  try {
      res = await translate(inputText, {to: inputLang});
  } catch (e) {
    msg.edit('Failed translate your text :(');
  };
  msg.edit(res.text);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['gtranslate'],
  permLevel: "Users"
};

exports.help = {
  name: "translate",
  category: "unity",
  description: "translate your text into another language.",
  usage: "translate (text)"
};
