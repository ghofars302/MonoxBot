const randomfact = [
  'No u',
  'adk',
  'NotSoSuper#0001',
  'Monodoxy Computer',
  'Glitch.com',
  'Myself?',
  'Shit',
  'FBI',
  'Google',
  'Some cunts',
  'Fuck off',
  'Ultra Nigger',
  'Nep nep',
  'Nepu nepu',
  'Kiss x sis',
  'Oreimo',
  'Anime',
  'Osu!',
  'mania?',
  'Circle clicker?',
  'Cancer',
  'Insert Funny fact here',
  'nigga',
  'nigger',
  'NotSoBot tags',
  'Nope',
  'Indonesian',
  'US VPN'
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

exports.run = async (client, message, args, level) => {
      function isURL(value) {
         return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value);
      }
      const Content = args.join(" ");
      var exec = require('child_process').exec;
      const msg = await message.channel.send('Pinging...');
      async function output(error, stdout, stderr)
      {
          msg.edit("\`\`\`xl\n"+stdout+"\`\`\`");
      }
      var msgExec = `ping -c 4 "${Content}" `;
      if (Content.length > 5 && (isURL(Content)))
          return exec(msgExec, output);
      else
          return msg.edit('Pong! It took ``' + Math.round(client.ping) + 'ms`` to ping **' + randomItem(randomfact) + '**');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Users"
};

exports.help = {
  name: "ping",
  category: "Miscelaneous",
  description: "Ping to discord API. or Ping website!",
  usage: "ping || ping (link)"
};
