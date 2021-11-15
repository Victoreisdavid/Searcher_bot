const API = require('./API');
const axios = require('axios');

const API_URL = 'https://ffstaticdata.switchblade.xyz'

module.exports = class NPMApi extends API {
    constructor() {
        super('freefire');
    }

    getGuns(query, language = 'pt') {
        return axios({
            params: {
                text: encodeURIComponent(query)
            },
            url: `${API_URL}/${language}/weapons.json`
        }).then(r => {
            return r.data.weapons;
        }).catch(e => {
            throw new Error(`Request failed`, e)
        })
    }
}