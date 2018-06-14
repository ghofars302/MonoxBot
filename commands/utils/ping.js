const {platform} = require('os');
const {exec} = require('child_process');
const {resolve4} = require('dns');

module.exports = {
	description: 'Get client latency or ping website.',
	category: 'Util',
	cooldown: 1000,
    args: '(URL)',
	run: async function (ctx, args, argsString) {
		if (!argsString) return ctx.send(`Took \`\`${Math.round(ctx.main.ping)}ms\`\` to ping **${randomMessage.random()}**`);

        resolve4(argsString, function(err, res) {
            if (err) return ctx.send(`Took \`\`${Math.round(ctx.main.ping)}ms\`\` to ping **${randomMessage.random()}**`);
            if (platform() === 'win32') {
                 return exec(`ping ${argsString.replace(/([$(){-}|=*\+_\\&^%#@!-])+/g, '')}`, async(err, stdout, stderr) => {
                    if (err) {
                        await ctx.send(err, {
                            code: 'xl'
                        })
                        return;
                    }
    
                    await ctx.send(stdout, {
                        code: 'xl'
                    })
                })
            }
            exec(`ping -c 4 ${argsString.replace(/([$(){-}|=*\+_\\&^%#@!-])+/g, '')}`, async(err, stdout, stderr) => {
                if (err) {
                    await ctx.send(err, {
                        code: 'xl'
                    })
                    return;
                }

                await ctx.send(stdout, {
                    code: 'xl'
                })
            })
        })
	}
};

const randomMessage = [
    'Invalid arguments',
    'MonoxBot',
    'Hmm me',
    'Russian hacker LOL',
    'Monodoxy',
    'Monox'
]