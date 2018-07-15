
const {stripIndent} = require('common-tags');

module.exports = {
    description: 'Clean messages with filter or not.',
    category: 'Utils',
    args: '<Number> <Filter>',
    aliases: ['purge'],
    guildOnly: true,
    adminGuildOnly: true,
    cooldown: 2000,
    run: async function (ctx, { args }) {
        if (!ctx.channel.permissionsFor(ctx.guild.me).has('MANAGE_MESSAGES')) return 'This command require permission `MANAGE_MESSAGES`';
        if (args.length < 1) return stripIndent `
                    \`\`\`
                    ${ctx.prefix}clean <Number> <Filter>

                    Filters:
                    -bots       Clean messages that send by bots
                    -links      Clean messages that has links
                    -invite     Clean messages that has invite links
                    -monoxbot   Clean messages that send by MonoxBot
    
                    Clean messages with filter or not.
                    \`\`\`
                `

        const rawNumber = args.shift().replace(/\D+/g, '');
        const realNumber = parseInt(rawNumber);

        if (isNaN(realNumber) || realNumber < 1) return ':x: `Must provided number between 1-100`';
        if (realNumber > 100) return ':x: `Maximum delete number is 100`';

        const filter = args.join(' ').toLowerCase();

        /* eslint-disable no-unused-vars */
        if (filter) {
            let FilterMessage;
            if (filter === 'invite') {
                FilterMessage = message => message.content.search(/(discord\.gg\/.+|discordapp\.com\/invite\/.+)/i) !== -1; // eslint-disable-line no-useless-escape
            } else if (filter === 'links') {
                FilterMessage = message => message.content.search(/https?:\/\/[^ \/\.]+\.[^ \/\.]+/) !== -1; // eslint-disable-line no-useless-escape
            } else if (filter === 'bots') {
                FilterMessage = message => message.author.bot;
            } else if (filter === 'monoxbot') {
                FilterMessage = message => message.author.id === ctx.main.user.id;
            } else if (filter === 'self') {
                FilterMessage = message => message.author.id === ctx.author.id;
            } else {
                return ':x: `Invalid filter`';
            } 

            const messages = await ctx.channel.messages.fetch({limit: realNumber}).catch(error => null);
            const DeletMessages = messages.filter(FilterMessage);

            ctx.channel.bulkDelete(DeletMessages.array().reverse()).catch(error => null);

            return true;
        }

        const messages = await ctx.channel.messages.fetch({limit: realNumber}).catch(error => null);
        ctx.channel.bulkDelete(messages.array().reverse()).catch(error => null);
        /* eslint-enable no-unused-vars */

        return true;
    }   
}