const Bluebird = require('bluebird');

module.exports = {
    description: 'Just a test',
    cooldown: 60000,
    run: async ctx => {
        const lol = await ctx.reply('test');

        await Bluebird.delay(2000);

        lol.edit('Nothing')
    }
}