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

    return new Promise(async (resolve, reject) => {
        try {
            const result = await fetch(`http://processing.matmen.me:3000/${endpoint}`, requestOptions);

            if (result.status !== 200) {
                const text = await result.text();

                return reject(new fAPI.Error(text));
            }

            const buffer = await result.buffer()

            resolve(buffer);
         } catch (error) {
             reject(error);
         }
    });
}

fAPI.path = async function() {
    const res = await fetch(`http://processing.matmen.me:3000/pathlist`);

    const path = await res.json();

    return path.paths;
}

fAPI.method = async function() {
    const res = await fetch(`http://processing.matmen.me:3000/pathlist`);

    const path = await res.json();

    return path.defaultRequestBody;
}

fAPI.Error = class fAPIError extends Error {
    constructor(reason) {
        super(reason);
        this.name = 'fAPIError';
    }
}

module.exports = fAPI;
