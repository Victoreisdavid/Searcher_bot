const API = require('./API');
const axios = require('axios');

const API_URL = "https://discord.com/api/v9"

module.exports = class DISCORDAPI extends API {
    constructor() {
        super('discord');
    }

    async get_guild_member(guildID, userID) {
        if(!guildID || !userID) throw new Error("Invalid user or guild ID.")
        const r = await axios({
            headers: {
                Authorization: `Bot ${process.env.BOT_TOKEN}`
            },
            url: API_URL + `/guilds/${guildID}/members/${userID}`
        }).catch(e => {
            return null
        })
        return r.data
    }

    async get_user(ID) {
        if(!ID) throw new Error("Please, provide a ID.")
        const r = await axios({
            headers: {
                Authorization: `Bot ${process.env.BOT_TOKEN}`
            },
            url: API_URL + `/users/${ID}`
        }).catch(e => {
            return null
        })
        return r.data
    }

    async search_member(guildID, query) {
        if(!guildID || !query) throw new Error("Invalid guild id or query.")
        const r = await axios({
            params: {
                query: query,
                limit: 25
            },
            headers: {
                Authorization: `Bot ${process.env.BOT_TOKEN}`
            },
            url: API_URL + `/guilds/${guildID}/members/search`
        }).catch(e => {
            return []
        })
        return r.data
    }
}