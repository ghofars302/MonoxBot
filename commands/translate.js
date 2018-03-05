const translate = require('google-translate-api');
const stripIndents = require('common-tags').stripIndents;

exports.run = async (client, message, args, level) => {
      const textTranslate = args.join(" ");
      try {
        let l
      }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [gtranslate],
  permLevel: "User"
};

exports.help = {
  name: "translate",
  category: "unity",
  description: "translate your text into another language.",
  usage: "translate (text)"
};
