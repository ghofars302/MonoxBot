const request = require('request-promise');
const MonoxAPIError = require('./MonoxAPIError')
const NekosAPI = require('./nekos.json');

/**
 * Get random image(s) from nekos.life.
 * @param {string} type Nekos type should be requested, see "./nekos.json" 
 */
const get = async (type, text) => {
    const URI = 'https://nekos.life/api/v2';
    if (type === undefined) type = 'neko';

    if (type === 'owo') {
        return new Promise(async (res, rej) => {
            try {
                const rest = await request({
                    uri: `${URI}/owoify`,
                    qs: {
                        text: text
                    },
                    json: true
                });
                res(rest.owo)
            } catch (error) {
                rej(error)
            }
        })
    }

    if (!Object.keys(NekosAPI).includes(type)) throw new MonoxAPIError('Nekos type not matched in nekos.life');

    const res = await request({
        uri: URI + NekosAPI[type],
        json: true
    });

    return res.url;
}

module.exports = {
    get
};