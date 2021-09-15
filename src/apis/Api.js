const HTTPS = require('https');
const HTTP = require('http');
const Zlib = require('zlib');
const { URL } = require('url');

module.exports = class API {
  constructor(name, envVars) {
    this.name = name;
    this.envVars = envVars;
  }

  _request(method, url, options = {}) {
    return new Promise(async(resolve, reject) => {
      const parsedUrl = new URL(url);
      const request = await this.createRequest({
        method,
        hostname: parsedUrl.hostname || options.hostname || undefined,
        agent: options.agent || undefined,
        port: options.port || undefined,
        path: url,
        secure: url.startsWith('https')
      }).catch(e => reject(e));
      if(!request) return reject(new Error('Failed to create request instance.'));

      let error;
      request
      .on('abort', () => {
        error = error || new Error('Request aborted.');
        return reject(error);
      })
      .on('error', (err) => {
        error = err;
        request.abort();
      })
      .on('response', (response) => {
        response.on('aborted', () => {
          error = error || new Error('Request aborted.');
          return reject(error);
        });
        const stream = this.createStream(response, response.headers['content-encoding']);
        let data;
        stream
        .on('data', (d) => {
          if(d instanceof ArrayBuffer || Buffer.isBuffer(d)) {
            if(!data) data = [];
            data.push(Buffer.from(d));
          };
          if(typeof d === 'string') {
            if(!data) data = '';
            data += d;
          };
        })
        .on('error', err => {
          error = err;
          request.abort();
        })
        .on('end', () => {
          let allowedStatus = [200, 202, ...(options.allowedStatus || [])];
          if(options && options.parsing) {
            if(options.parsing === 'json') {
              if(Array.isArray(data)) data = Buffer.concat(data).toString();
              data = JSON.parse(data);
            } else if(options.parsing === 'buffer') {
              if(Array.isArray(data)) data = Buffer.concat(data);
              else data = Buffer.from(data);
            };
          };
          if(allowedStatus.includes(response.statusCode)) {
            return resolve(data);
          };
          return reject(new Error(`Request returned with status code ${response.statusCode}(${response.statusMessage})`));
        });
      });
    });
  }

  createStream(response, contentEncoding) {
    if(contentEncoding.includes('gzip')) {
      response = response.pipe(Zlib.createGunzip());
    } else if(contentEncoding.includes('deflate')) {
      response = response.pipe(Zlib.createInflate());
    }
    return response;
  }

  createRequest(secure, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        let requester = secure ? HTTPS : HTTP;
        let request = requester.request(options);
        return resolve(request);
      } catch (e) {
        return reject(e);
      }
    });
  }
}