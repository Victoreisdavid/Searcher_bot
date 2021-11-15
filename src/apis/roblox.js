const API = require('./API');
const axios = require('axios');

const APIs_URLS = {
    USERS: "https://users.roblox.com/v1/users",
    AVATARS: "https://avatar.roblox.com/v1/users",
    ASSETS: "https://assetdelivery.roblox.com/v1/asset",
    BADGES: "https://badges.roblox.com/v1/users"
}

module.exports = class ROBLOXApi extends API {
    constructor() {
        super('roblox');
    }

    search_user(query) {
        if(!query) throw new Error("Please provide a query to search.")
        return axios({
            params: {
                keyword: encodeURIComponent(query),
                limit: 25
            },
            url: APIs_URLS.USERS + "/search"
        }).then(r => {
            if (!r.data) return []
            return r.data
        }).catch(e => {
            return null
        })
    }

    get_user(id) {
        if(!id) throw new Error("Please provide a ID")
        return axios({
            url: APIs_URLS.USERS + `/${id}`
        }).then(r => {
            if (!r.data) return null
            return r.data
        }).catch(e => {
            return null
        })
    }

    get_user_avatar(id) {
        if(!id) throw new Error("Please provide a ID")
        return axios({
            url: APIs_URLS.AVATARS + `/${id}/avatar`
        }).then(r => {
            if (!r.data) return null
            return r.data
        }).catch(e => {
            return null
        })
    }

    get_user_badges(id, limit = 100) {
        if(!id) throw new Error("Please provide a ID.")
        return axios({
            params: {
                userId: encodeURIComponent(id),
                limit: limit
            },
            url: APIs_URLS.BADGES + `/${id}/badges`
        }).then(r => {
            if (!r.data) return null
            return r.data
        }).catch(e => {
            return null
        })
    }

    get_asset(params) {
        if(!params) throw new Error("Please, provide params.")
        return axios({
            url: APIs_URLS.ASSETS,
            params: params,
            responseType: "arraybuffer"
        }).then(r => {
            return r.data
        }).catch(e => {
            return null
        })
    }
}