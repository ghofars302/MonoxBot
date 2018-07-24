const fetch = require('node-fetch');
const Promise = require('bluebird');

const fAPI = async function (endpoint, options) {
    const http = require('http');
    const agent = new http.Agent({
        rejectUnauthorized: false
    });

    const requestOptions = {
        agent,
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.matmen,
            'User-Agent': `MonoxFramework ${require('../package.json')['version']} (MonoxBot)`
        },
        body: JSON.stringify({
            images: options.images,
            args: options.args                                
        })
    };

    const result = await fetch(`http://processing.matmen.me:3000/${endpoint}`, requestOptions);

    if (result.status !== 200) {
        const text = await result.text();

        return Promise.reject(new fAPI.Error(text));
    }

    /* eslint-disable no-negated-condition */
    const buffer = await result.buffer();
    return buffer;
}

fAPI.Error = class fAPIError extends Error {
    constructor(reason) {
        super(reason);
        this.name = 'fAPIError';
    }
}

module.exports = fAPI;