const API = require('./API');
const axios = require('axios');

const API_URL = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery';

module.exports = class VSCodeExtensionsAPI extends API {
    constructor() {
        super('vscode');
    }

    async search(name) {
        return axios({
            data: {
                filters: [{
                    criteria: [
                        {
                            filterType: 10,
                            value: name
                        },
                        {
                            filterType: 8,
                            value: "Microsoft.VisualStudio.Code"
                        }
                    ]
                }],
                flags: 262
            },
            headers: {
                accept: 'application/json; api-version=3.0-preview',
                'accept-encoding': 'gzip',
                'content-type': 'application/json; api-version=3.0-preview.1'
            },
            url: API_URL,
            method: 'POST'
        }).then(res => {
            return res.data ?.results[0] ?.extensions ?? []
        });
    }
}