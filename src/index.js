/*
	Arquivo principal.
*/
const app = require("express")()
const bodyparser = require("body-parser")
const nacl = require("tweetnacl")
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

app.use(bodyparser.json({
 verify: (req, res, buf) => {
  req.rawBody = buf
 }
}))

app.get("/", function(req, res) {
 res
 .status(200)
 .send("Olá mundo!")
})

app.post("/api/interaction", async function(req, res) {
 const signature = req.headers["x-signature-ed25519"]
 const timestamp = req.headers["x-signature-timestamp"]
 const body = req.rawBody
 if(!timestamp || !signature || !body) {
  await invalidreq(req.get("origin"))
  return res.sendStatus(401)
 }
 const isVerified = nacl.sign.detached.verify(
  Buffer.from(timestamp + body),
  Buffer.from(signature, 'hex'),
  Buffer.from(publickey, 'hex')
 );
 if(!isVerified) {
  await invalidreq(req.get("origin"))
  return res.status(401).send("invalid request signature")
 }
 if(req.body.type == 1) {
  await discordreq()
  return res.status(200).json({
   type: 1
  })
 } else if(req.body.type == 3) {
     const command = commands.get(req.body.message.interaction.name)
     command.handleInteraction(req.body).then(response => {
		 return res.status(200).json(response)
		 }).catch(e => {
		  return res.status(200).json({
			 type: 4,
			 data: {
			  content: `<:shit:887428144469000252> Aconteceu um erro quando você interagiu com a mensagem\n\`\`\`js\n${e}\`\`\``,
			  flags: 64
			 }
			})
		})
	} else {
	   const command = commands.get(req.body.data.name)
	   command.execute(req.body).then(response => {
		 return res.status(200).json(response)
		}).catch(e => {
		  return res.status(200).json({
			type: 4,
			 data: {
			  content: `<:shit:887428144469000252> Aconteceu um erro\n\`\`\`js\n${e}\`\`\``,
			  flags: 64
			 }
		  })
		})
	}
})

app.listen(process.env.PORT || 3030)