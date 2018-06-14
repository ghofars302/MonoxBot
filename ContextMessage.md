#ContextMessage in MonoxBot

if you know it's just a wrapper around discord.Message that will make more simple than typing ``message.channel.send`` but instead only type ``ctx.send`` to send message.


``ctx.main`` - access to main Bot client.
``ctx.send`` - a wrapper around ``message.channel.send``.
``ctx.reply`` - same with ``ctx.send`` but it will mention the author if in guild.
``ctx.react`` - a wrapper around ``message.react``.
``ctx.channel`` - a short for ``message.channel``. 

