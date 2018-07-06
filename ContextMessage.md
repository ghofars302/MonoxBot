Context object in MonoxBot framework
====================================

I made this context to support command Editing like if you change bot or other bot command the bot will delete last message, more like undo thing in NSB's

In command object if command return `String` it automatic send into invoker channel.

* `ctx` - A context object for easy command editing in `./const/events.js`.
* `message` - to access `message` object.
* `reply` - It's wrapper like `channel#send` but it will store message object in memory to make it support command Editing.
* `direct` - same as `ctx#reply` but it will send to author `DMChannel` instead.
* `isDM` - A function to check it's DM Channel or not.
* `bot` - to access Bot object.
* `main` - to access Main Client object.
* `author` - same as `message.author`.
* `member` - same as `message.member` if in guild.
* `users` - short way to access `client#users`.
* `channel` - to access current Channel Object.
* `channels` - short way to access `client#channels`.
* `createdAt` - show `message#createdAt`.
* `guild` - to access current Guild Object.
* `guilds` - short way to access `client#guilds`.
* `isNSFW` - to check if `channel#nsfw` true or not.
* `react` - react author message.
* `delete` - a function to delete author message.