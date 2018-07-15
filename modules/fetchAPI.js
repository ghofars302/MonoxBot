const Bluebird = require('bluebird');
const MonoxAPIError = require('./MonoxAPIError');
const request = require('request-promise');

const endpoints = {
    magick: '/magick',
    charcoal: '/charcoal' 
}

module.exports = {
    image: async function (type, url) {
        if (!Object.keys(endpoints).includes(type)) throw new MonoxAPIError('Unknown image processing type.');

        return new Bluebird(async (resolve, reject) => {
            try {
                const result = await request({
                    method: 'POST',
                    uri: 'https://monoxapi.glitch.me/api' + endpoints[type],
                    qs: {
                        key: process.env.KEY1,
                        url: url
                    },
                    json: true
                });

                if (res.ERROR) reject(new MonoxAPIError(res.ERROR));

                const buffer = Buffer.from(res.BUFFER.data);

                resolve(buffer);
            } catch (error) {
                if (error instanceof Error) reject(error);
                reject(new MonoxAPIError(error.message));
            }
        })
    },
    screenshot: async function (url) {
        if (!url) url = 'https://google.com';

        return new Bluebird(async (resolve, reject) => {
            try {
                const result = await request({
                    method: 'POST',
                    uri: 'https://monoxscreenshot.glitch.me/api',
                    qs: {
                        key: process.env.KEY1,
                        url: url
                    },
                    json: true
                });

                if (res.ERROR) reject(res.ERROR);

                const buffer = Buffer.from(res.BUFFER.data);

                resolve(buffer);
            } catch (error) {
                if (error instanceof Error) reject(error);
                reject(new MonoxAPIError(error.message));
            }
        })
    }
}