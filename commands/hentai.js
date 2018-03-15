const snekfetch = require('snekfetch');
const randomThing = require('random-puppy');
const fs = require("fs")

exports.run = (client, message, args, level) => {
  if(!message.channel.nsfw) return message.channel.send(':underage: ``NSFW only``');
  var subReddits = [
    'HENTAI_GIF',
    'hentai_irl'
  ]
  var red = subReddits[Math.roubd(math.random() * (subReddits.length -1))];
  randomThing(red).then(result => {
    snekfetch.get(result).then(image => {
      fs.writeFile('hentai.jpg', r.body)
      message.channel.send(r.body);
      fs.unlink('./hentai.jpg');
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Users"
};

exports.help = {
  name: "hentai",
  category: "nsfw",
  description: "Send random hentai images from reddit",
  usage: "hentai"
};
