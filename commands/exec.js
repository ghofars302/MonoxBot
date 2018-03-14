exports.run = async (client, message, args, level) => {
  const code = args.join(" ");
  var exec = require('child_process').exec;
  async function output(error, stdout, stderr)
  {
    if(error) return message.channel.send("\`\`\`xl\n"+stderr+"\`\`\`");
    message.channel.send("\`\`\`xl\n"+stdout+"\`\`\`");
  }
  if(code)
    return exec(code, output);
  else
    return message.channel.send('```\nexec (command)\n\neval system command```');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ceval'],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "exec",
  category: "System",
  description: "Execute system command",
  usage: "exec || ceval [...code]"
};
