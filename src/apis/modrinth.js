const API = require('./API');
const axios = require('axios');

const API_URL = "https://api.modrinth.com/api/v1"

module.exports = class MODRINTHAPI extends API {
    constructor() {
        super('modrinth');
    }

    search_mod(query, index) {
        return axios({
            params: {
                query: query,
                index: index,
                limit: 25
            },
            url: API_URL + "/mod"
        }).then(res => {
            return res.data
        }).catch((e) => {
            console.log(e)
            return null
        })
    }

}