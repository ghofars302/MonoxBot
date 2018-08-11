const codeBlockRegex = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;

class argsParser {
    constructor() {}

    async parseArgsCommand(msgArgument, ctx, command) {
        const args = {};
        const defaultArgs = {};

        defaultArgs.argsString = msgArgument.join(' ');
        defaultArgs.args = this.SplitArgs(defaultArgs.argsString);

        if (!command.args) return defaultArgs;

        switch (command.args.type) {
            case 'code':
                if (codeBlockRegex.test(defaultArgs.argsString)) {
                    const parsed = codeBlockRegex.exec(defaultArgs.argsString);
                    args.code = parsed[2];
                    args.lang = parsed[1] ? parsed[1].toLowerCase() : null;

                    return args;
                }

                args.code = defaultArgs.argsString;
                args.lang = null;

                return args;
            case 'member':
                if (ctx.guild) {
                    const member = ctx.bot.utils.getMemberFromString(ctx.message, defaultArgs.argsString);
    
                    args.member = member ? member : null;

                    return args;
                }

                args.member = null;

                return args;

            case 'user':
                if (/^[0-9]+$/.test(defaultArgs.argsString)) {
                    try {
                        const user = ctx.users.has(defaultArgs.argsString) ? ctx.users.get(defaultArgs.argsString) : await ctx.users.fetch(defaultArgs.argsString);
                        args.user = user;

                        return args
                    } catch (error) {
                        args.user = null;
                    }
                }
                if (ctx.guild) {
                    let result;

                    const fetched = ctx.bot.utils.getMemberFromString(ctx.message, defaultArgs.argsString);
                    if (fetched) result = fetched.user;
                    if (!result) {
                        try {
                            result = ctx.users.has(defaultArgs.argsString) ? ctx.users.get(defaultArgs.argsString) : await ctx.users.fetch(defaultArgs.argsString);
                        } catch (error) {
                            result = null;
                        }
                    }
                    
                    args.user = result;

                    return args;
                }

                args.user = null

                return args;
            case 'message':
                if (ctx.guild) {
                    if (/^[0-9]+$/.test(defaultArgs.argsString)) {
                        try {
                            const fetched = ctx.channel.messages.has(defaultArgs.argsString) ? ctx.channel.messages.get(defaultArgs) : await ctx.channel.messages.fetch(defaultArgs.argsString);
                            args.message = fetched;

                            return args;
                        } catch (error) {
                            args.message = ctx.message;
                        }
                    }
                }

                args.message = ctx.message;

                return args;
            default:
                return defaultArgs;
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
