module.exports = {
  limitations: {
    register: {
      global: true,
      local: false
    }
  },
  command: {
    name: "blacklist",
    description: "[ PRIVADO ] banir um usuário de usar o Searcher.",
    options: [
      {
        type: 3,
        name: "id",
        description: "ID do usuário.",
        required: true
      },
      {
        type: 3,
        name: "motivo",
        description: "Motivo do banimento.",
        required: true
      }
    ]
  },
  execute: async function(data) {
    const author = data.member ? data.member.user : data.user
    if(!Config.bot.dev_ids.includes(author.id)) {
      return {
        type: Constants.callback_type.MESSAGE,
        data: {
          content: ":rage: Isso não foi feito pra você.",
          flags: Constants.message_flags.EPHEMERAL
        }
      }
    }
    const ID = data.data.options[0].value
    const reason = data.data.options[1].value
    const r = await change_user_blacklist(ID, reason)
    if(r == 1) {
      return {
       type: Constants.callback_type.MESSAGE,
       data: {
         content: "<:warn:886469809712291850> Usuário banido."
       } 
      }
    } else {
      return {
        type: Constants.callback_type.MESSAGE,
        data: {
          content: "<:warn:886469809712291850> Usuário desbanido."
        }
      }
    }
  }
}

async function change_user_blacklist(userID, reason) {
  let data = await DB_MODEL.findOne({ userID: userID })
  if(!data) {
    data = create_user_blacklist(userID, reason)
  }
  if(data.blacklisted) {
    await DB_MODEL.updateOne({ userID: userID, reason: reason, blacklisted: false })
    return 0
  } else {
    await DB_MODEL.updateOne({ userID: userID, reason: reason, blacklisted: true, blacklist_reason: reason })
    return 1
  } 
}

function create_user_blacklist(userID, reason) {
  const d = new DB_MODEL({ userID: userID, blacklisted: true, blacklist_reason: reason })
  return d.save()
}