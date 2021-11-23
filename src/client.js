const eris = require("eris-additions")(require("eris"))
const { patch } = require("axios")
const mongoose = require("mongoose")
let cache;
let CONNECTED = false
let ID;

const valid_providers = ["redis", "mongodb", "mongodb+srv"]
const PROVIDER = process.env.CACHE_PROVIDER_URL
const PROVIDER_NAME = PROVIDER.split(":")[0]
if(!valid_providers.includes(PROVIDER_NAME)) {
    throw new Error(`Provedor de cache inválido \"${PROVIDER_NAME}\". Atualmente o searcher suporta mongoDB e Redis para caching.`)
}

if(valid_providers.includes("mongodb")) {
    console.log(colors.yellow("Mongodb detectado como provedor de cache."))
    cache = require("abstract-cache-mongo")({
        dbName: "results-store",
        segment: "results",
        mongodb: {
            url: process.env.DB_URL,
            connectOptions: {
                useUnifiedTopology: true
            }
        }
    })
    cache.start()
} else if(valid_providers.includes("redis")) {
    console.log(colors.yellow("Redis detectado como provedor de cache."))
    cache = require("abstract-cache-redis")({
        useAwait: true,
        ioredis: {
            host: PROVIDER
        }
    })
}

/**
 * Função que cria o objeto do bot
 * @param {Boolean} connect define se deve conectar ao gateway do discord ou não.
 * @returns {undefined} 
*/
function init(connect) {
    if(connect) {
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
        ID = bot.user.id

        /* 
        * Eventos
        */
        bot.on("ready", async () => {
            if(CONNECTED) return console.log(colors.yellow("Searcher reconectado ao gateway após uma perca de conexão."))
            console.log(colors.green("Searcher conectado ao gateway com sucesso!"))
            connect_db()
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

    } else {
        global.bot = {}
        bot.connect = function() {
            return null
        }
        ID = Config.bot.id
        connect_db()
    }
    bot.results_store = cache
    bot.genToken = genToken
    bot.editInteraction = editInteraction

    /* 
    * Conectando ao gateway do discord :D yay.
    * Lembrando que se connect não for true, isso só vai retornar null.
    */
    bot.connect()
}

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
    await patch(`https://discord.com/api/v9/webhooks/${ID}/${token}/messages/@original`, data)
    .then(d => {
        return true
    })
    .catch(() => {
        return false
    })
}

async function connect_db() {
    await mongoose.connect(process.env.DB_URL)
    const UsersSchema = new mongoose.Schema({
        userID: Number,
        blacklisted: Boolean,
        blacklist_reason: String
    })
    global.DB_MODEL = mongoose.model("Users", UsersSchema)
}

module.exports = {
    init: init
}