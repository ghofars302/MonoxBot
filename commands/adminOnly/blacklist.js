module.exports = {
	description: 'Remove user from blacklist.',
    category: 'adminOnly',
    args: '(user...)',
	adminOnly: true,
	run: async function (ctx, args, argsString) {
        if (!argsString) return this.messageHandler.invalidArguments(ctx.message);

        const member = this.utils.getUser(ctx, argsString)

        if (!member) return ctx.send(`:x: \`\`User ${args} not found\`\``);
        if (member.bot) return ctx.send(`:x: \`\`User ${member.tag} is a bot.\`\``);

        const json = require('../../config/blacklist.json');
        const UserID = Array.from(json['UserID']);

        if (UserID.includes(member.id)) return ctx.send(':x: ``That user already in the list``');

        const fs = this.fs;
        fs.readFile('config/blacklist.json', function(err, data) {
            if (err) {
                console.log(err);
                return ctx.send(':warning: Unable to load file.');
            }
            const obj = JSON.parse(data);

            obj.UserID.push(member.id);
    
            const jsonRaw = JSON.stringify(obj);
    
            fs.writeFile('config/blacklist.json', jsonRaw, 'utf8', function(err) {
                if (err) return ctx.send(':warning: ``Error while write the file.``');
                ctx.send(`:white_check_mark: \`\`Blacklist ${member.tag} from use MonoxBot\`\``);
            })
        })
	}
}

