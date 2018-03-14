const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, args, level) => {
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  message.channel.send('Bot online for ``' + duration + '``');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Users"
};

exports.help = {
  name: "uptime",
  category: "Unity",
  description: "See bot uptime",
  usage: "uptime"
};
