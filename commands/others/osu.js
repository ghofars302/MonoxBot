const MonoxCommand = require('../../const/MonoxCommand.js');

class OsuCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'osu',
            aliases: [],
            group: 'others',
            memberName: 'osu',
            description: 'Get osu player profile.\nList available game mode format: \n-standard\n-taiko\n-ctb\n-mania',
            examples: ['(Game mode) (Player name)'],
			throttling: {
				usages: 1,
				duration: 2.5
			}
        })
    }

    async run(msg, args) {
        if (!args) return this.utils.invalidArgument(msg);

        let argSplit = this.utils.splitArgs(args);
        let ModeSelect = argSplit[0].toLowerCase();
        const Modes = ['standard', 'mania', 'catch', 'taiko', 'ctb'];

        if (Modes.includes(ModeSelect)) {
            if (!argSplit[1]) return msg.channel.send('A player name is required.');
            let query = argSplit[1].slice(argSplit[0].length);

            let rawResult = await this.utils.FetchOsuAPI(query, ModeSelect, 'get_user');
            let parsedResult = await rawResult.json();
            if (!Object.keys(parsedResult).length) {
                return msg.channel.send(`:x: \`\`Player name ${query} not found \`\``);
            }
            let embed = new this.api.MessageEmbed();

            embed.setTitle('osu! Player profile.')
                .addField('Username', parsedResult[0].username)
                .addField('User ID', parsedResult[0].user_id)
                .addField('Country', parsedResult[0].country)
                .addField('PP (Based on selected mode)', Math.round(parsedResult[0].pp_raw))
                .addField('Accuracy (Based on selected mode)', Math.round(parsedResult[0].accuracy))

            msg.channel.send(embed);
        } else {
            msg.channel.send('Invalid game mode. - Please try the folowing gamemode \n```standard, mania, catch, taiko```');
        }
    }
}

module.exports = OsuCommand;