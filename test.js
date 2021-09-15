const API = require('./src/apis/Api');
const api = new API('a', 'b');

api._request('GET', 'https://open.spotify.com/get_access_token', {
  parsing: 'json'
})
.then(r => console.log(r))
.catch(e => console.error(e));