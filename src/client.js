const eris = require("eris-additions")(require("eris"))
const axios = require("axios")

global.bot = new eris(process.env.BOT_TOKEN, {
 defaultImageFormat: "png",
 defaultImageSize: 2048,
 getAllUsers: false,
 disableEvents: {
  CHANNEL_CREATE: true,
  CHANNEL_DELETE: true,
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
  PRESENCE_UPDATE: true,
  GUILD_MEMBER_ADD: true,
  GUILD_MEMBER_REMOVE: true,
  GUILD_MEMBER_UPDATE: true
 },
 messageLimit: 10
})

bot.on("ready", () => {
 console.log("iniciado!")
})

bot.on("messageCreate", (message) => {
 if(message.content) {
  if(message.content == `<@${bot.user.id}>` || message.content == `<@!${bot.user.id}>`) {
   return message.channel.createMessage(`Olá ${message.author.mention}, eu sou o Searcher, para obter ajuda, digite \`/help\`\nCaso os comandos não apareçam, verifique se eu fui adicionado com permissão de criar comandos.`)
  }
 }
})

bot.on("error", (err) => console.log("aconteceu um erro.", err))

bot.connect()