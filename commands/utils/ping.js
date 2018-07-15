const {exec} = require('child-process-promise');
const {resolve4} = require('dns');
const {platform} = require('os');

module.exports = {
    description: 'Get client lantecy or ping a website',
    args: '<URLs> or <IPs>',
    cooldown: 1000,
    run: async function (ctx, { argsString }) {
        const msg = await ctx.reply('Pinging...');

        if (!argsString) return msg.edit(`Pong... <Message: Took \`\`${msg.createdTimestamp - ctx.message.createdTimestamp}ms\`\`, Client \`\`${Math.round(ctx.main.ping)}ms\`\`>`);

        resolve4(argsString, async(err, res) => { // eslint-disable-line no-unused-vars
            if (err) return msg.edit(`Pong... <Message: Took \`\`${msg.createdTimestamp - ctx.message.createdTimestamp}ms\`\`, Client \`\`${Math.round(ctx.main.ping)}ms\`\`>`);

            if (platform() === 'win32') {
                try {
                    const pinged = await exec(`ping ${argsString.replace(/([$\(\){-}|=:";'*\+_\\&^%#@!-])+/g, '')}`); // eslint-disable-line no-useless-escape

                    return msg.edit(pinged.stdout, {code: 'xl'});
                } catch (error) {
                    return msg.edit(error, {code: 'xl'});
                }
            } else {
                try {
                    const pinged = await exec(`ping -c 4 ${argsString.replace(/([$\(\){-}|=:";'*\+_\\&^%#@!-])+/g, '')}`); // eslint-disable-line no-useless-escape

                    return msg.edit(pinged.stdout, {code: 'xl'});
                } catch (error) {
                    return msg.edit(error, {code: 'xl'});
                }
            }
        })
    }
}