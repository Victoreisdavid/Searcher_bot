module.exports = {
 command: {
  name: "freefire",
  description: "Pesquise coisas do FreeFire.",
  options: [
   {
    type: 2,
    name: "weapon",
    description: "Veja informações sobre as armas do jogo.",
    options: [
     {
      type: 1,
      name: "search",
      description: "Pesquise uma arma do freefire.",
      options: [
       {
        type: 3,
        name: "query",
        description: "nome a ser pesquisado",
        required: true
       }
      ]
     }
    ]
   }
  ],
 },
 execute: async function(data) {
  if(data.data.options[0].options[0].name == "search") {
   return await search_gun(data)
  }
 },
 handleInteraction: async function(data) {
  const author = data.member ? data.member.user : data.user
  if(author.id != data.message.interaction.user.id) {
	 return {
    type: 4,
		data: {
		 flags: 64,
		 content: "<:warn:886469809712291850> Apenas o autor do comando pode selecionar um resultado."
	  }
	 }
  }
  const weapons = await apis.freefire.getGuns()
  const weapon = weapons.find(w => w.name == data.data.values[0])
  if(!weapon) {
   return {
    type: 4,
    data: {
     content: "<:shit:887428144469000252> Ué, não achei nada",
     flags: 64
    }
   }
  }
  const attributes = weapon.attributes
  return {
   type: 7,
   data: {
    embeds: [
     {
      title: weapon.name,
      description: weapon.description,
      fields: [
       {
        name: "<:pepe_gun:886468234444955738> Características gerais",
        value: `**Dano:** \`${attributes.damage}\`\n**Alcance:** \`${attributes.range}\`\n**Precisão:** \`${attributes.accuracy}\`\n**Cadência de tiro:** \`${attributes.rate_of_fire}\`\n**Munição:** \`${attributes.magazine}\`` 
       },
       {
        name: ":person_walking: Mobilidade",
        value: `**Velocidade de movimento (com a arma)**: \`${attributes.movement_speed}\`\n**Velocidade de recarga:** \`${attributes.reload_speed}\``
       }
      ],
      thumbnail: {
       url: "https://cdn.discordapp.com/attachments/886564394711011349/888182407935688704/AKedOLQyg8WvakSde1GgxVVtXWrwi1ORkHJUI-QfW7_b0Qs900-c-k-c0x00ffffff-no-rj.png"
      },
      image: {
       url: weapon.skins[0] ? weapon.skins[0].image_url : "https://cdn.discordapp.com/attachments/886564394711011349/888182407935688704/AKedOLQyg8WvakSde1GgxVVtXWrwi1ORkHJUI-QfW7_b0Qs900-c-k-c0x00ffffff-no-rj.png"
      },
      footer: {
       text: "Fonte: https://ffstaticdata.switchblade.xyz/pt/weapons.json"
      } 
     }
    ]
   }
  }
 }
}

async function search_gun(data) {
 const query = data.data.options[0].options[0].options[0].value
 const weapons = await apis.freefire.getGuns()
 weapons.forEach((w, i) => {
  weapons[i].displayName = w.name
  weapons[i].name = w.name.toLowerCase()
 })
 const filteredWeapons = weapons.filter(weapon => weapon.name.includes(query.toLowerCase()))
 if(filteredWeapons.length > 15) {
  filteredWeapons.splice(0, 15)
 }
 if(filteredWeapons.length == 0) {
  return {
   type: 4,
   data: {
    content: "<:warn:886469809712291850> não achei nenhum resultado!",
    flags: 64
   }
  }
 }
 const mappedWeapons = filteredWeapons.map((weapon, i) => i + " - " + weapon.displayName)
 const options = []
 filteredWeapons.forEach(weapon => {
  options.push(
   {
    label: weapon.displayName,
    value: weapon.displayName
   }
  )
 })
 return {
  type: 4,
  data: {
   embeds: [
    {
     title: "Free fire",
     description: `Pesquisei por **${query}** na lista de armas do free fire, e achei **${filteredWeapons.length}** resultados.`,
     fields: [
      {
       name: ":mag_right: Resultados",
       value: mappedWeapons.join("\n")
      }
     ]
    }
   ],
   components: [
    {
      type: 1,
      components: [
       {
        type: 3,
        custom_id: "ff_select_box",
        placeholder: "Selecione a arma",
        options: options
       } 
     ]
    }
   ]
  }
 } 
}