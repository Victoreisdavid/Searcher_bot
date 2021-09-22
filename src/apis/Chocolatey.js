const API = require('./API');
const axios = require('axios');

const API_URL = 'https://chocolatey.org/api/v2/Search()';

module.exports = class ChocolateyAPI extends API {
  constructor() {
    super('chocolatey');
  }

  search(query) {
    return axios({
      params: {
        $filter: 'IsLatestVersion',
        $skip: 0,
        $top: 10,
        searchTerm: encodeURIComponent(`'${query}'`),
        targetFramework: "''",
        includePrerelease: false
      },
      method: 'GET',
      url: API_URL
    }).then(r => r.data?.d?.results ?? [])
  }
}