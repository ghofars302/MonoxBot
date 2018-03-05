const { inspect } = require("util");
exports.run = async (client, message, [action, key, ...value], level) => {
  const settings = client.settings.get(message.guild.id);
  if (action === "add") {
    if (!key) return message.channel.send("Please specify a key to add");
    if (settings[key]) return message.channel.send("This key already exists in the settings");
    if (value.length < 1) return message.channel.send("Please specify a value");
    settings[key] = value.join(" ");
    client.settings.set(message.guild.id, settings);
    message.channel.send(`:white_check_mark: \`\`${key}\`\` successfully added with the value of \`\`${value.join(" ")}\`\``);
  } else
  if (action === "edit") {
    if (!key) return message.channel.send("Please specify a key to edit");
    if (!settings[key]) return message.channel.send("This key does not exist in the settings");
    if (value.length < 1) return message.channel.send("Please specify a new value");

    settings[key] = value.join(" ");

    client.settings.set(message.guild.id, settings);
    message.channel.send(`:white_check_mark: \`\`${key}\`\` successfully edited to \`\`${value.join(" ")}\`\``);
  } else
  if (action === "del") {
    if (!key) return message.channel.send("Please specify a key to delete.");
    if (!settings[key]) return message.channel.send("This key does not exist in the settings");
    const response = await client.awaitReply(message, `Are you sure you want to permanently delete ${key}? This **CANNOT** be undone.`);
    if (["y", "yes"].includes(response)) {
      delete settings[key];
      client.settings.set(message.guild.id, settings);
      message.channel.send(`${key} was successfully deleted.`);
    } else
    if (["n","no","cancel"].includes(response)) {
      message.channel.send("Action cancelled.");
    }
  } else

  if (action === "get") {
    if (!key) return message.channel.send("Please specify a key to view");
    if (!settings[key]) return message.channel.send("This key does not exist in the settings");
    message.channel.send(`The value of ${key} is currently ${settings[key]}`);
  } else {
    message.channel.send(inspect(settings), {code: "json"});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings", "conf"],
  permLevel: "Administrator"
};

exports.help = {
  name: "set",
  category: "System",
  description: "View or change settings for your server.",
  usage: "set <view/get/edit> <key> <value>"
};
