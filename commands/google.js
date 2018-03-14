const got = require('got');
const cheerio = require('cheerio');

const QUERY_STRING_SETTINGS = [
    'client=chrome',
    'rls=en',
    'ie=UTF-8',
    'oe=UTF-8'
].join('&');

function getText(children) {
    if (children.children) return getText(children.children);
    return children.map(c => {
        return c.children ? getText(c.children) : c.data;
    }).join('');
}

exports.run = async (client, message, args, level) => {
  if (args.length < 1) {
    return message.channel.send('You must enter something to search for!');
  }
  const msg = await message.channel.send('Searching...');

  const res = await got(`https://google.com/search?${QUERY_STRING_SETTINGS}&q=${encodeURIComponent(args.join(' '))}`);
  if (res.statusCode !== 200) {
    return msg.edit(`:no_entry_sign: Error! (${res.statusCode}): ${res.statusMessage}`);
  }
  let $ = cheerio.load(res.body);
  let results = [];

  $('.g').each((i) => {
      results[i] = {};
  });

  $('.g>.r>a').each((i, e) => {
      let raw = e.attribs['href'];
      results[i]['link'] = decodeURIComponent(raw.substr(7, raw.indexOf('&sa=U') - 7));
  });

  $('.g>.s>.st').each((i, e) => {
      results[i]['description'] = getText(e);
  });
  let output = results.filter(r => r.link && r.description)
      .slice(0, 5)
      .map(r => `${r.link}\n\t${r.description}\n`)
      .join('\n');
  msg.edit({embed: {
    description: `Search results for \`"${args.join(' ')}"\``, output
  }});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['g'],
  permLevel: "Users"
};

exports.help = {
  name: "google",
  category: "unity",
  description: "Search things in google using magic!",
  usage: "google || g (text)"
};
