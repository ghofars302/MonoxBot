module.exports = async function (db) {
	await db.query('CREATE TABLE IF NOT EXISTS commands ("id" BIGINT NOT NULL, "command" TEXT NOT NULL, "userid" BIGINT NOT NULL, "channelid" BIGINT NOT NULL, "serverid" BIGINT NOT NULL)');
	await db.query('CREATE TABLE IF NOT EXISTS settings ("server" BIGINT NOT NULL, "setting" TEXT NOT NULL, "value" TEXT)');
	await db.query('CREATE TABLE IF NOT EXISTS blacklists ("type" TEXT NOT NULL, "id" BIGINT NOT NULL)');
	await db.query('CREATE TABLE IF NOT EXISTS tags ("name" TEXT NOT NULL, "content" TEXT NOT NULL, "userid" BIGINT NOT NULL, "guildid" BIGINT)');
};