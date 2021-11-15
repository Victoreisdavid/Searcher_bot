const deepAI = require("deepai")
const API = require('./API');
const axios = require('axios');

deepAI.setApiKey(process.env.DEEPAI_KEY)

module.exports = class DEEPAI extends API {
    constructor() {
        super('deep_ai');
    }

    async scan_nsfw(img) {
        try {
            const result = await deepAI.callStandardApi("nsfw-detector", {
                image: img
            })
            return result
        } catch (e) {
            console.log(e)
            return null
        }
    }
}