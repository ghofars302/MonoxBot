const enmap = require('enmap');
const enmapSQLITE = require('enmap-sqlite');

class Provider {
    constructor() {
        this.db = new enmap({ provider: new enmapSQLITE({ name: 'settings' })});
    }

    get(id) {
        return this.db.get(id);
    }

    set(id, key, value) {
        let settings = {}

        settings[key] = value ? value : null

        return this.db.set(id, settings);
    }

    remove(id) {
        if (!this.db.has(id)) throw new Error(`${id} has no settings`);
        return this.db.remove(id);
    }

    getBlacklist() {
        return this.db.get('blacklist');
    }
}

module.exports = Provider;