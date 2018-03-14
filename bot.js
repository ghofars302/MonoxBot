
if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");
const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const client = new Discord.Client();
client.config = require("./config.js");
client.logger = require("./util/Logger");
require("./util/utils.js")(client);
client.commands = new Enmap();
client.aliases = new Enmap();
client.settings = new Enmap({provider: new EnmapLevel({name: "settings"})});
const init = async () => {
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });
  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }
  client.login(client.config.token);
};

init();
