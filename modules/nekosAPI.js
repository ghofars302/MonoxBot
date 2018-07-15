const request = require('request-promise');
const MonoxAPIError = require('./MonoxAPIError')
const NekosAPI = require('./nekos.json');
const Bluebird = require('bluebird');
const URI = 'https://nekos.life/api/v2';

/**
 * Get random image(s) from nekos.life.
 * @param {String} type Nekos type should be requested, see "./nekos.json".
 */
const get = async (type) => {
    if (type === undefined) type = 'neko';

    if (!Object.keys(NekosAPI).includes(type)) throw new MonoxAPIError('Nekos type not matched in nekos.life');

    return new Bluebird(async (resolve, reject) => {
        try {
            const res = await request({
                uri: `${URI}${NekosAPI[type]}`,
                json: true
            });

            resolve(res.url)
        } catch (error) {
            reject(error)
        }
    });
};

/**
 * Turn text into owo
 * @param {String} text Input text.
 */
const owo = async (text) => {
    return new Bluebird(async (resolve, reject) => {
        try {
            const res = await request({
                uri: `${URI}/owoify`,
                qs: {
                    text: text
                },
                json: true
            });

            resolve(res.owo)
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    get,
    owo
};