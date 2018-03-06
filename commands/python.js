exports.run = async (client, message, args, level) => {
  var PythonShell = require('python-shell');
  var options = {
    mode: 'text',
    pythonOptions: ['-u'],
    args: ['value1', 'value2', 'value3']
  };
  try {
    if(!args || args.lenght < 1) return message.channel.send('Where the script?');
    PythonShell.run('my_script.py', options, function (err, results) {
      message.channel.send(client.clean(results));
    });
  } catch (e) {
    console.log(e);
    message.channel.send(`\`\`\`${e}\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['py'],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "python",
  category: "unity",
  description: "Execute python script. (in-beta stage)",
  usage: "python || py (script)"
};
