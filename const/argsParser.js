class argsParser {
    constructor(handler) {
        this.handler = handler;
    }

    async parseArgsCommand(msgArgument, ctx, command) {
    
        let argsString = msgArgument.join(' ');
        let args = this.SplitArgs(argsString);

        if (!command.args || typeof command.args === 'string') return { args, argsString };

        if (!argsString && command.args.default) {
            args = [command.args.default];
            argsString = command.args.default;
        }

        if (!argsString && command.args.require) return this.handler.invalidArguments(ctx, 'Missing argument!!!');

        switch (command.args.type) {
            case 'code':
                const codeBlockRegex = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i; // eslint-disable-line no-case-declarations
			
                if (codeBlockRegex.test(argsString)) {
                    const parsed = codeBlockRegex.exec(argsString);

                    return { code: parsed[2], lang: parsed[1] ? parsed[1].toLowerCase() : null }
                }

                return { code: argsString, lang: null }
            case 'member':
                if (ctx.guild) {
                    const member = ctx.bot.utils.getMemberFromString(ctx.message, argsString);

                    return { member: member ? member : null }
                }

                return { member: null }

            case 'user':
                if (/^[0-9]+$/.test(argsString)) {
                    try {
                        const user = ctx.users.has(argsString) ? ctx.users.get(argsString) : await ctx.users.fetch(argsString);

                        return { user: user }
                    } catch (error) {
                        return { user: null }
                    }
                }
                if (ctx.guild) {
                    let result;

                    const fetched = ctx.bot.utils.getMemberFromString(ctx.message, argsString);
                    if (fetched) result = fetched.user;
                    if (!result) {
                        try {
                            result = ctx.users.has(argsString) ? ctx.users.get(argsString) : await ctx.users.fetch(argsString);
                        } catch (error) {
                            result = null;
                        }
                    }

                    return { user: result }
                }

                return { user: null }
            case 'message':
                if (ctx.guild) {
                    if (/^[0-9]+$/.test(argsString)) {
                        try {
                            const fetched = ctx.channel.messages.has(argsString) ? ctx.channel.messages.get(argsString) : await ctx.channel.messages.fetch(argsString);

                            return { message: fetched }
                        } catch (error) {
                            return { message: ctx.message }
                        }
                    }
                }

                return { message: ctx.message }
            case 'integer':
                return { number: parseInt(argsString) }
            
            default: 
                if (typeof command.args.type === 'undefined') return { args, argsString }
                throw new Error(`Argument type: ${command.args.type} not supported`);
        }
    }

    SplitArgs(string) {
        const splitArguments = string.trim().split('');

		const args = [];
		let inMultiwordArg = false;
		let currentArg = '';

		for (const char of splitArguments) {

			if (char === '"') {
				inMultiwordArg = !inMultiwordArg;
			} else if (char === ' ' && !inMultiwordArg && currentArg) {
				args.push(currentArg);
				currentArg = '';
			} else if (char !== ' ' || inMultiwordArg) currentArg += char;

		}

		if (currentArg) args.push(currentArg);

		return args;
    }
}

module.exports = argsParser;
