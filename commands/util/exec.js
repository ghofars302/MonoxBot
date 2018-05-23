const MonoxCommand = require('../../const/MonoxCommand.js');

class ExecCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'exec',
            aliases: ['ceval'],
            group: 'util',
            memberName: 'exec',
            description: 'Execute system command..',
            examples: ['(Command line.)'],
            ownerOnly: true
        })
    }

    async run(msg, args) {
        if (!args) return this.utils.invalidArgument(msg);
        this.childprocess.exec(args, this.output(msg));
    }

    output(msg) {
        return async (error, stdout, stderr) => {
            if (error) {
                await msg.channel.send(stderr, {
                    code: "xl"
                });
            } else {
                if (stdout.length < 1) return msg.channel.send('✅ Task executed!, but no output were return.', {
                    code: "xl"
                });
                if (stdout.length > 2000) return msg.channel.send('✅ Task executed!, but the output length was over 2000 word.', {
                    code: "xl"
                });
                await msg.channel.send(stdout, {
                    code: "xl"
                });
            }
        }
    }
};

module.exports = ExecCommand;