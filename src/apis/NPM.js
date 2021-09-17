const API = require('./API');
const axios = require('axios');

const API_URL = 'https://registry.npmjs.org/-/v1/search'

module.exports = class NPMApi extends API {
  constructor() {
    super('npm');
  }

  search(query) {
    return axios({
      params: {
        text: encodeURIComponent(query)
      },
      url: API_URL
    }).then(r => {
      if(!r.data || !r.data.objects) return []
      return r.data.objects;
    }).catch(e => {
      return []
    })
  }
}