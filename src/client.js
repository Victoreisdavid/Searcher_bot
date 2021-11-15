const eris = require("eris-additions")(require("eris"))
const { patch } = require("axios")
const mongoose = require("mongoose")
let CONNECTED = false

/* 
 * Criando o client do eris
 * Caso queira ativar um evento, retire ele do "disableEvents" ou então coloque o valor para false
*/
global.bot = new eris(process.env.BOT_TOKEN, {
    defaultImageFormat: "png",
    defaultImageSize: 2048,
    getAllUsers: false, //<-- Coloque isso pra true se você quer um cache de usuários mais preciso.
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
    messageLimit: 25
})
bot.results_store = new Map()
bot.genToken = genToken
bot.editInteraction = editInteraction


/* 
 * Eventos
*/
bot.on("ready", async () => {
    if(CONNECTED) return console.log(colors.yellow("Searcher reconectado ao gateway após uma perca de conexão."))
    console.log(colors.green("Searcher conectado ao gateway com sucesso!"))
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
    if(message.content) {
        if(message.content == `<@${bot.user.id}>` || message.content == `<@!${bot.user.id}>`) {
            return message.channel.createMessage(`Olá ${message.author.mention}, eu sou o Searcher, para obter ajuda, digite \`/help\`\nCaso os comandos não apareçam, verifique se eu fui adicionado com permissão de criar comandos.`)
        }
    }
}) //<-- Retirar isso pode gerar um pequeno ganho de desempenho, única função disso aqui é fazer o searcher responder quando mencioado.

bot.on("error", (err) => console.log("aconteceu um erro.", err)) //<-- não retirar essa budega de evento aqui, já que o eris resolve "kk vou desconectar aqui rapidão", sem esse evento dá erro e o processo morre.

//Lembrando: Se for retirar algum evento, convém desativar eles também lá em cima, na declaração do client, assim não serão processados e irá gerar um ganho de desempenho.

/* 
 * Conectando ao gateway do discord :D yay.
*/
bot.connect()

/**
 * Gera um token completamente aleatório para guardar um resultado.
 * @param {Number} length Tamanho do token.
 * @returns {String} Token gerado.
*/
function genToken(length) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz"
    const chars_splitted = chars.split("")
    const token = []
    for (let i = 0; i < length; ++i) {
        token.push(
            chars_splitted[Math.floor(Math.random() * chars_splitted.length)]
        )
    }
    return token.join("")
}

/**
 * Edita uma resposta inicial do comando.
 * @param {String} token O token da interação
 * @param {String} data O novo conteúdo da mensagem
 * @returns {Boolean} Retorna true se conseguir editar, false se um erro acontecer.
*/
async function editInteraction(token, data) {
    try {
        const r_data = await patch(`https://discord.com/api/v9/webhooks/${bot.user.id}/${token}/messages/@original`, data)
        return true
    } catch (e) {
        return false
    }
}