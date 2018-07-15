/* eslint-disable no-console */
const util = require('util');

const logger = function (log) {
    console.log(log)
    return 'Logged into console'
}

logger.error = function (error) {
    if (error instanceof Object) error = util.inspect(error);
    console.error(`[MonoxBot Framework] [ERROR] \n${(error && error.stack) || error}`);
    return 'Logged into console'
}

logger.debug = function (debug) {
    console.log(`[MonoxBot Framework] [DEBUG] \n${debug}`);
    return 'Logged into console'
}

logger.log = function (client, log) {
    if (!client) return console.log(log);
    console.log(`[SHARD ${client.shard.id}] ${log}`)
    return 'Logged into console'
}

module.exports = logger