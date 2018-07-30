const { stripIndent } = require('common-tags')

module.exports = {
	description: 'Base command for tags',
	category: 'Utils',
	args: '(name) [args] | add (name) (content..) | edit (name) (content..) | rename (name) (newName) | gift (name) (newOwner) | delete (name) | raw (name) | owner (name) | list [user]',
	aliases: ['t'],
	cooldown: 1000,
	run: async function (ctx, { args }) {
		if (args.length === 0) return invalidArgument(ctx)

		if (['add', 'create'].includes(args[0].toLowerCase())) {

			if (args.length < 3) return ':x: `Please input tag  name to create`';
      const name = args[0].toLowerCase()
      
      if (['add', 'create', 'edit', 'gift', 'dump', 'delete', 'owner'].includes(name)) return ':x: `You can\'t create tag with that name because that was keyword`';
      
			const content = args.splice(2, args.length).join(' ');
      if (content.length < 1) return ':x: `You must input content`';

			const tags = await this.utils.queryDB('SELECT content FROM tags WHERE name = $1', [name]);
			if (tags.rowCount > 0) return `:x: Tag **${name}** already exists!`
			await ctx.bot.utils.queryDB('INSERT INTO tags VALUES ($1, $2, $3)', [name, content, ctx.author.id]);
			return `:white_check_mark: Created tag **${name}**!`

		} else if (args[0].toLowerCase() === 'edit') {

			if (args.length < 3) return ':x: `You must input tag to edit`';

			const name = args[1].toLowerCase();
			const content = args.splice(2, args.length).join(' ');
      
      if (content.length < 1) return ':x: `You must input content`';

			const tag = await this.utils.queryDB('SELECT userid FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return `:x: \`Tag **${name}** not found!\``
			if (!this.utils.isAdmin(ctx.author.id) && ctx.author.id !== tag.rows[0].userid) return ':x: `You don\'t own that tag!`'

			await this.utils.queryDB('UPDATE tags SET content = $2 WHERE name = $1', [name, content]);
			return `:pencil: Updated tag **${name}**`

		} else if (args[0].toLowerCase() === 'rename') {

			if (args.length < 3) return ':x: `You must input tag`';

			const name = args[1].toLowerCase();

			const tag = await this.utils.queryDB('SELECT userid FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return `:x: Tag **${name}** not found!`
			if (!this.utils.isAdmin(ctx.author.id) && ctx.author.id !== tag.rows[0].userid) return ':x: `You don\'t own that tag!`';

			const newName = args[2].toLowerCase();

			await this.utils.queryDB('UPDATE tags SET name = $2 WHERE name = $1', [name, newName]);
			return `:pencil: Renamed tag **${name}** to **${newName}**`

		} else if (args[0].toLowerCase() === 'gift') {

			if (args.length < 3) return ':x: `You must input tag name to gift`';

			const name = args[1].toLowerCase();
			let user = ctx.author;

			if (args[2]) {
				const match = this.utils.getMemberFromString(ctx.message, args[2]);
				if (match) user = match.user;
			}

			const tag = await this.utils.queryDB('SELECT userid FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return `:x: Tag **${name}** not found!`
			if (!this.utils.isAdmin(ctx.author.id) && ctx.author.id !== tag.rows[0].userid) return ':x: `You don\'t own that tag!`'

			if (user.id === ctx.author.id) return ':x: `You cant gift tags to yourself!`'
			if (user.id === this.client.user.id) return ':x: `You cant gift tags to me!`'

			await this.utils.queryDB('UPDATE tags SET userid = $2 WHERE name = $1', [name, user.id]);
			return `:gift: Gifted tag **${name}** to **${user.tag}**`

		} else if (['delete', 'remove'].includes(args[0].toLowerCase())) {

			if (args.length < 2) return ':x: `You must input tag`';

			const name = args.splice(1, args.length).join(' ').toLowerCase();

			const tag = await this.utils.queryDB('SELECT userid FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return `:x: Tag **${name}** not found!`
			if (!this.utils.isAdmin(ctx.author.id) && ctx.author.id !== tag.rows[0].userid) return ':x: `You don\'t own that tag!`'

			await this.utils.queryDB('DELETE FROM tags WHERE name = $1', [name]);
			return `:wastebasket: Deleted tag **${name}**`

		} else if (['raw', 'view'].includes(args[0].toLowerCase())) {

			if (args.length < 2) return ':x: `You must input tag`';

			const name = args[1].toLowerCase();

			const tag = await this.utils.queryDB('SELECT content FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return `:x: Tag **${name}** not found!`

			return ctx.reply(tag.rows[0].content, {
				code: true
			});

		} else if (args[0].toLowerCase() === 'owner') {

			if (args.length < 2) return ':x: `Please input tag name`';

			const name = args.splice(1, args.length).join(' ').toLowerCase();

			const tag = await this.utils.queryDB('SELECT userid FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return `:x: Tag **${name}** not found!`

			const userID = tag.rows[0].userid;
      const user = await ctx.users.fetch(userID);

			return `:bust_in_silhouette: Tag **${name}** is owned by **${user.id}**`

		} else if (args[0].toLowerCase() === 'list') {

			if (args[1] === 'all') {

				const tags = await this.utils.queryDB('SELECT name FROM tags');

				return ctx.reply(`All tags (\`${tags.rowCount}\`):`, {
					files: [{
						attachment: Buffer.from(tags.rows.map(r => r.name).join('\n'), 'utf-8'),
						name: 'alltags.txt'
					}]
				});

			} else {

				let user = ctx.author;

				if (args[1]) {
					const match = this.utils.getMemberFromString(ctx.message, args[1]);
					if (match) user = match.user;
				}

				const tags = await this.utils.queryDB('SELECT name FROM tags WHERE userid = $1', [user.id]);

				const tagList = tags.rows.map(r => r.name.includes(' ') ? `"${r.name}"` : r.name).join('\n') || 'This user made no tags';

				if (tagList.length > 2048) {

					return ctx.reply(`\`${user.tag}\`'s tags (\`${tags.rowCount}\`):`, {
						files: [{
							attachment: Buffer.from(tagList, 'utf-8'),
							name: `tags-${user.username}-${user.discriminator}.txt`
						}]
					});

				} else {
					const embed = new ctx.bot.api.MessageEmbed();

					embed.setTitle(`${user.tag}'s Tags`);
					embed.setDescription(tagList);
					embed.setColor(0xff3366);

					return ctx.reply({
						embed
					});
				}

			}

		} else if (args[0].toLowerCase() === 'dump') {

			let user = ctx.author;

			if (args[1]) {
				const match = ctx.bot.utils.getMemberFromString(ctx.message, args[1]);
				if (match) user = match.user;
			}

			const tags = await ctx.bot.utils.queryDB('SELECT name, content FROM tags WHERE userid = $1', [user.id]); 
      
      return ctx.reply(`Tag dump for \`${user.tag}\` (\`${tags.rowCount}\` Tags):`, {
				files: [{
					attachment: Buffer.from(JSON.stringify(tags.rows, null, 4), 'utf-8'),
					name: `tagdump-${user.username}-${user.discriminator}.json`
				}]
			});

		} else {

			const name = args[0].toLowerCase();

			const tag = await ctx.bot.utils.queryDB('SELECT content FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return `:x: Tag **${name}** not found!` 
      
      return ctx.utils.filterMentions(tag.rows[0].content);
      
		}
	}
};

const invalidArgument = (ctx) => stripIndent`
  \`\`\`
  ${ctx.prefix}tag <name> | create | owner | dump | list | delete | raw | gift

  Subcommands:
  - create <Content> (Create a tag)
  - owner <Tag> (Get tag owner)
  - dump <User> (Get all dump of tag)
  - list <User> (Get list tags)
  - delete <tag> (Delete tag)

  Base of custom command.
  \`\`\`
`
