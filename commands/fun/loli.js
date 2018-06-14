module.exports = {
	description: 'LOLIIIII',
    category: 'fun',
	run: ctx => {
        ctx.send(new ctx.bot.api.MessageEmbed()
            .setDescription('Stop it, get some help')
            .setImage('https://media1.tenor.com/images/2dcc02dff6f5c7ec24cf1e66bc7e45c1/tenor.gif?itemid=7929301')
        )
    }
}