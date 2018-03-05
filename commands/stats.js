const { version } = require("discord.js");
const os = require('os');
const moment = require("moment");
require("moment-duration-format");
require('loadavg-windows')

exports.run = (client, message, args, level) => {
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  var byte = os.totalmem();
  message.channel.send({embed: {
  	description: `**::BOT STATISTICS::**\`\`\`asciidoc\n• CPU Usage  :: ${os.loadavg()} \n• Mem Usage  :: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB of ${Math.round(byte/1073741824)} GB \n• Uptime     :: ${duration} \n• Platform   :: '${os.type()}' \n• Discord.js :: v${version} \n• Node       :: ${process.version}\`\`\``
}});
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['statistic'],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "Miscelaneous",
  description: "Show bot statistic like: Cpu usage, Memory Usage, Node version, Discord.js version.",
  usage: "stats"
};
