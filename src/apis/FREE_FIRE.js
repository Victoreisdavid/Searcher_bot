const API = require('./API');
const axios = require('axios');

const API_URL = 'https://ffstaticdata.switchblade.xyz/pt/weapons.json'

module.exports = class NPMApi extends API {
  constructor() {
    super('freefire');
  }

  getGuns(query) {
    return axios({
      params: {
        text: encodeURIComponent(query)
      },
      url: API_URL
    }).then(r => {
      return r.data.weapons;
    }).catch(e => {
      throw new Error(`Request failed`, e)
    })
  }
}