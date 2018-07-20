const express = require('express'),
    app = express(),
    fs = require('fs'),
    path = require('path');

module.exports = class appWeb {
    constructor() {
        this.commands = this.commandList();

        this.init();
    }

    init() {
        app.get('/api/commands', (req, res) => {
            res.status(200).json(this.commands);
        });

        app.use('/', (req, res) => {
            res.status(200).send(`MonoxBot ${require(../package.json)['version']} API, use /api/commands to get list of MonoxBot commands.`);
        });

        app.listen(3000);

        setInterval(() => {
            this.commands = this.commandList()
        }, 60000);
    }

    commandList() {
        const commands = [];

        const loadCommandsIn = (dir) => {
            for (const subName of fs.readdirSync(dir)) {
                if (fs.statSync(path.resolve(dir, subName)).isDirectory()) {
                    loadCommandsIn(path.resolve(dir, subName));
                } else {
                    let file = path.resolve(dir, subName);
                    let name = subName.substring(0, subName.lastIndexOf('.')).toLowerCase();
                    if (require.cache[require.resolve(file)]) delete require.cache[require.resolve(file)];

                    const command = require(file);
                    commands.push({
                        name: require('../config/config.json')['prefix'] + name,
                        description: command.description,
                        aliases: command.aliases,
                        args: command.args,
                        category: command.category
                    });
                }
            }
        };

        loadCommandsIn('./commands/');

        return commands;
    }
}
