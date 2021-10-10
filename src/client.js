const eris = require("eris-additions")(require("eris"))
const axios = require("axios")
const mongoose = require("mongoose")
let CONNECTED = false

global.bot = new eris(process.env.BOT_TOKEN, {
  defaultImageFormat: "png",
  defaultImageSize: 2048,
  getAllUsers: false,
  disableEvents: {
    CHANNEL_UPDATE: true,
    GUILD_BAN_ADD: true,
    GUILD_BAN_REMOVE: true,
    GUILD_MEMBER_UPDATE: true,
    GUILD_ROLE_CREATE: true,
    GUILD_ROLE_DELETE: true,
    GUILD_ROLE_UPDATE: true,
    MESSAGE_DELETE: true,
    MESSAGE_DELETE_BULK: true,
    TYPING_START: true,
    VOICE_STATE_UPDATE: true,
    PRESENCE_UPDATE: true
  },
  messageLimit: 10,
  restMode: true
})

bot.on("ready", async () => {
  console.log("iniciado!")
  if(CONNECTED) return;
  await mongoose.connect(process.env.DB_URL)
  const UsersSchema = new mongoose.Schema({
    userID: Number,
    blacklisted: Boolean,
    blacklist_reason: String
  })
  global.DB_MODEL = mongoose.model("Users", UsersSchema)
  CONNECTED = true
})

bot.on("messageCreate", (message) => {
  if (message.content) {
    if (message.content == `<@${bot.user.id}>` || message.content == `<@!${bot.user.id}>`) {
      return message.channel.createMessage(`Olá ${message.author.mention}, eu sou o Searcher, para obter ajuda, digite \`/help\`\nCaso os comandos não apareçam, verifique se eu fui adicionado com permissão de criar comandos.`)
    }
  }
})

bot.on("error", (err) => console.log("aconteceu um erro.", err))

bot.connect()