module.exports = {
	description: 'Restart process on current shard.',
	category: 'adminOnly',
	adminOnly: true,
	run: async function (ctx, args, argsString) {
                if (argsString) {
                        argsString = argsString.toLowerCase();
                        if (argsString === 'all' || argsString === 'global') {
                                const message = await ctx.reply(':warning: ``Confirm restart all shard!``');
        
                                const confirm = await this.ConfirmationHelper.initConfirm(message, ctx.author);
            
                                confirm.on('timeout', () => message.edit('Restart all shard canceled due timeout.'));
            
                                confirm.on('false', () => message.edit('Action canceled'));
            
                                confirm.on('true', async () => {
                                        await message.edit('Restarting all shard...');
                                        return ctx.client.shard.broadcastEval('process.exit()');
                                });
                                return;
                        }
                        return ctx.reply(':x: ``Invalid options``');
                }
                const message = await ctx.reply(':warning: ``Confirm restart current shard!``');
        
                const confirm = await this.ConfirmationHelper.initConfirm(message, ctx.author);
    
                confirm.on('timeout', () => message.edit('Restart current shard canceled due timeout.'));
    
                confirm.on('false', () => message.edit('Action canceled'));
    
                confirm.on('true', async () => {
                     await message.edit('Restarting current shard...');
                     return process.exit();
                });
        }
}

