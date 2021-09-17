const path = require('path');
const fs = require('fs');

let apisObj = {};

const apisPath = path.join(__dirname, 'apis');
const files = fs.readdirSync(apisPath);
files.map(file => {
  const a = require(`./apis/${file}`);
  const api = new a();
  if(!api.name) return;
  if(api.env && !api.env.every(env => !!process.env[env])) return;
  apisObj[api.name] = api;
})
console.log(`${Object.values(apisObj).length} apis carregadas.`);
global.apis = apisObj;