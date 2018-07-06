const request = require('request-promise');
const MonoxAPIError = require('./MonoxAPIError')

const endpoints = {
    "magick": "/magick",
    "charcoal": "/charcoal"
}

module.exports = async (type, imageURL) => {
    const URI = 'https://monoxapi.glitch.me/api';

    if (!Object.keys(endpoints).includes(type)) throw new MonoxAPIError('No API type called.');

    const res = await request.post({
        uri: URI + endpoints[type],
        qs: {
            key: process.env.KEY1,
            url: imageURL
        },
        json: true
    });

    if (res.ERROR) throw new MonoxAPIError('connection timeout.');

    const buffer = Buffer.from(res.BUFFER.data);

    return buffer;
}