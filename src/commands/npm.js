const search = require("libnpmsearch")
const { get } = require("axios")
const sections = new Map()

async function search_subcommand(data) {
 const libs = await search(data.data.options[0].options[0].value, {
    limit: 15
 })
 if(libs.length == 0) {
  return {
	type: 4,
	data: {
	content: `<:warn:886469809712291850> Não achei nenhum resultado.`,
	flags: 64
	}
  }
 }
 const mappedlibs = libs.map((lib, i) => i + " - " + lib.name)
 const options = []
 libs.forEach(lib => {
  options.push({	
	label: lib.name,
	value: lib.name,
   })
 })

 return {
  type: 4,
   data: {
    embeds: [
     {
	  title: "Searcher - npmjs.com",
	  description: `Pesquisei por \`${data.data.options[0].options[0].value}\` no npmjs, veja os resultados.`,
	  fields: [
	   {
		name: ":mag_right: Resultados da pesquisa",
	    value: mappedlibs.join("\n")
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
	   custom_id: "npm_select_box",
	   placeholder: "Selecione o resultado",
	   options: options
	  }
	 ]
    }
   ]
  }
 }
}

async function lookup_subcommand(data) {
 let lib = await search(data.data.options[0].options[0].value)
 let index = data.data.options[0].options[1]
 if(index) {
  index = index.value
 } else {
  index = 0
 }
 lib = lib[index]
 if(!lib) {
  return {
	type: 4,
	data: {
    content: `<:warn:886469809712291850> Não achei nenhum resultado.`,
	flags: 64
   }
  }
 }
 const links = lib.links
 const fields = []
 fields.push(
  {
   name: `:mag_right: Informações gerais`,
   value: `**Publicado por**: ${lib.publisher.username || "Desconhecido"} | \`${lib.publisher.email || "Sem email."}\`\n**Página no NPM**: ${links.npm}\n**Homepage**: ${links.homepage || links.npm}\n**Código fonte**: ${links.repository ? links.repository : `Não disponível.`}`
  }
 )

 fields.push(
  {
   name: "<:desktop:886471189017534494> Mantedores",
   value: lib.maintainers.map(maintainer => `${maintainer.username} | \`${maintainer.email}\``).join("\n")
  }
 )

 if(links.bugs) {
  fields.push(
   {
    name: "<:ebaa:886554070075203625> Ajudar é legal",
	value: `Caso você ache um problema em **${lib.name}**, considere abrir uma issue em: ${links.bugs}`
   }
  )
 }

 fields.push(
  {
   name: ":thinking: Como eu instalo?",
   value: `Abra o seu terminal, e rode o seguinte comando:\n\`\`\`npm install ${lib.name}\`\`\`\nCaso você use o Yarn:\n\`\`\`yarn add ${lib.name}\`\`\``
  }
 )
 return {
  type: 4,
   data: {
	embeds: [
	 {
	  title: `${lib.name} - v${lib.version}`,
	  description: lib.description,
	  fields: fields
	 }
   ]
  }
 }
}

/*
	informações que o comando irá exportar
*/
module.exports = {
 command: {
  name: "npm",
  description: "Interagir com a lista de pacotes oficial do node.js via discord",
   options: [
    {
	 type: 1,
	 name: "search",
	 description: "Pesquise algo na lista de pacotes oficial do node.js.",
	 options: [
	  {
	   type: 3,
	   name: "pesquisa",
	   description: "Pesquisa a ser feita",
	   required: true
	  }
	]
   },
   {
    type: 1,
	name: "lookup",
	description: "Veja informações sobre um pacote na lista oficial do node.js.",
	options: [
	  {
	   type: 3,
	   name: "nome",
	   description: "Nome do pacote",
	   required: true
	  },
	  {
	   type: 4,
	   name: "index",
	   description: "Posição do pacote na pesquisa",
	   required: false
	  }
    ]
   }
  ]
 },
 execute: async function(data) {
  const subcommand = data.data.options[0].name
	 if(subcommand == "search") {
	  return await search_subcommand(data)
	 } else if(subcommand == "lookup") {
	  return await lookup_subcommand(data)
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
	 let lib = await search(data.data.values[0])
	 lib = lib[0]
	 const links = lib.links
	 const fields = []
	 fields.push(
	  {
	   name: `:mag_right: Informações gerais`,
	   value: `**Publicado por**: ${lib.publisher.username || "Desconhecido"} | \`${lib.publisher.email || "Sem email."}\`\n**Página no NPM**: ${links.npm}\n**Homepage**: ${links.homepage || links.npm}\n**Código fonte**: ${links.repository ? links.repository : `Não disponível.`}`
	  }
	 )

	 fields.push(
	  {
	   name: "<:desktop:886471189017534494> Mantedores",
	   value: lib.maintainers.map(maintainer => `${maintainer.username} | \`${maintainer.email}\``).join("\n")
	  }
	 )

	 if(links.bugs) {
	 fields.push(
	  {
	   name: "<:ebaa:886554070075203625> Ajudar é legal",
	   value: `Caso você ache um problema em **${lib.name}**, considere abrir uma issue em: ${links.bugs}`
	  }
	 )
   }

  fields.push(
	 {
	  name: ":thinking: Como eu instalo?",
	  value: `Abra o seu terminal, e rode o seguinte comando:\n\`\`\`npm install ${lib.name}\`\`\`\nCaso você use o Yarn:\n\`\`\`yarn add ${lib.name}\`\`\``
	 }
 )
 return {
	type: 7,
	data: {
	 embeds: [
	  {
	   title: `${lib.name} - v${lib.version}`,
	   description: lib.description,
	   fields: fields
	  }
	 ]
   }
  }
 }
}