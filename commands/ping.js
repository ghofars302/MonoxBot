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
      const msg = await message.channel.send('Pinging...');
      const code = args.join(" ");
      try {
        if (!code) return msg.edit('Pong!. It took ``' + Math.round(client.ping) + 'ms`` to ping **' + randomItem(randomfact) + '**');
        var exec = require('child_process').execSync;
        let pinged = exec(`ping "${code}"`);
        msg.edit(`\`\`\`xl${pinged}\n\n\`\`\``)
      } catch (error) {
        msg.edit(`\`\`\`xl\nUnknown hostname : "${code}"\`\`\``);
        console.error(error)
      }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "ping",
  category: "Miscelaneous",
  description: "Ping to discord API. or Ping website!",
  usage: "ping || ping (link)"
};
