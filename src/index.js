/*
	Arquivo principal.
*/
require('./ApisLoader');
const app = require("fastify")()
const bodyparser = require("body-parser")
const nacl = require("tweetnacl")
const { existsSync, readFileSync } = require("fs")
const TOKEN = process.env.BOT_TOKEN
const publickey = Config.bot.public_key

async function invalidreq(origin) {
  bot.createMessage(Config.bot.logs.channel.id, {
    embed: {
      title: "<:warn:886469809712291850> Solicitação inválida",
      description: ":mag_right: Solicitação inválida detectada no endpoint, provavelmente é uma das verificações de rotina do discord.",
      fields: [
        {
          name: "<:desktop:886471189017534494> Informações da solicitação",
          value: `<:origin:886471923301744671> Origem: **${origin || "desconhecido"}**`
        }
      ]
    }
  })
}

async function discordreq() {
  bot.createMessage(Config.bot.logs.channel.id, {
    embed: {
      title: ":ballot_box_with_check: Solicitação do discord",
      description: "Solicitação do discord detectada, essa é uma das verificações de rotina feitas no endpoint pelo discord, nada grave."
    }
  })
}

/*app.use(bodyparser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))*/

app.register(require("fastify-raw-body"), {
  fields: "rawBody",
  global: true
})

app.register(require("fastify-static"), {
  root: __dirname + "/images"
})

app.get("/", function (req, res) {
  res
  .status(200)
  .send("Olá mundo!")
})

app.get("/api/ram/status", function(req, res) {
  const status = require("./utils/ramStatus")
  res.send(status.getStatus())
})

app.get("/cdn/:image", function(req, res) {
	res.removeHeader('Transfer-Encoding')
	res.removeHeader('X-Powered-By')
  let img = req.params["image"]
  if(!img) return res.status(404).send("Unknown image")
  if(!existsSync(`./src/images/${img}`)) return res.status(404).send("Unknown image")
  return res.sendFile(img)
})

app.post("/api/interaction", async function (req, res) {
  const signature = req.headers["x-signature-ed25519"]
  const timestamp = req.headers["x-signature-timestamp"]
  const body = req.rawBody
  if (!timestamp || !signature || !body) {
    await invalidreq(req.get("origin"))
    return res.sendStatus(401)
  }
  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, 'hex'),
    Buffer.from(publickey, 'hex')
  );
  if (!isVerified) {
    await invalidreq(req.get("origin"))
    return res.status(401).send("invalid request signature")
  }
  if (req.body.type == 1) {
    await discordreq()
    return res.status(200).send({
      type: 1
    })
  } else if (req.body.type == 3) {
    const command = commands.get(req.body.message.interaction.name)
    command.handleInteraction(req.body).then(response => {
      return res.status(200).send(response)
    })
    .catch(error => {
      return res.status(200).send({
        type: Constants.callback_type.MESSAGE,
        data: {
          content: `<:shit:887428144469000252> Aconteceu um erro quando você interagiu com a mensagem\n\`\`\`js\n${error}\`\`\``,
          flags: Constants.message_flags.EPHEMERAL
        }
      })
    })
  } else {
    const user_data = await getUserData(req.body)
    if(user_data.blacklisted) {
      return res.status(200).send({
        type: Constants.callback_type.MESSAGE,
        data: {
          embeds: [
            {
              title: "Parece que alguém foi banido.. que pena.",
              description: "Aparentemente você quebrou as **regras do Searcher**, mesmo elas sendo tão pequenas e liberais, você ainda conseguiu ser banido, sinceramente, meus parabéns :handshake:",
              fields: [
                {
                  name: "<:noo:886468596363059260> Quero ser desbanido",
                  value: `Você pode pedir um **apelo** no meu [servidor de suporte](https://discord.gg/fyVcBpfJpF), caso ache que seu banimento foi injusto (algo que provavelmente não procede).\n\nLembre-se que estar arrependido não significa que você será desbanido.`
                },
                {
                  name: "<:shit:887428144469000252> não lembro o motivo",
                  value: `<:warn:886469809712291850> Você foi banido por: \`${user_data.reason}\``
                }
              ]
            }
          ],
          flags: Constants.message_flags.EPHEMERAL
        }
      })
    }
    const command = commands.get(req.body.data.name)
    command.execute(req.body).then(response => {
      return res.status(200).send(response)
    })
    .catch(error => {
      return res.status(200).send({
        type: Constants.callback_type.MESSAGE,
        data: {
          content: `<:shit:887428144469000252> Aconteceu um erro\n\`\`\`js\n${error}\`\`\``,
          flags: Constants.message_flags.EPHEMERAL
        }
      })
    })
  }
})

async function getUserData(data) {
  const author = data.member ? data.member.user : data.user
  if(!author) {
    throw new Error("Cannot find interaction author.")
  }
  let db_data = await DB_MODEL.findOne({ userID: author.id })
  if(!db_data) {
    db_data = await createUserData(data)
  }
  if(db_data.blacklisted) {
    return {
      blacklisted: true,
      reason: db_data.blacklist_reason || "Sem motivo pro banimento.. kk emole"
    }
  } else {
    return {
      blacklisted: false
    }
  }
}

async function createUserData(data) {
  const user = data.member ? data.member.user : data.user
  if(!user) {
    throw new Error("Cannot find interaction author.")
  }
  const d_data = new DB_MODEL({ userID: user.id, blacklisted: false })
  return d_data.save()
}

app.listen(process.env.PORT || 3030, "0.0.0.0")