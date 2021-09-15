const util = require("util")
function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text
}

module.exports = {
	limitations: {
		register: {
			global: true,
			local: false
		}
	},
	command: {
		name: "eval",
		description: "Rodar códigos.",
		options: [
		    {
				type: 3,
				name: "código",
				description: "Código para carregar",
				required: true
			}
		]
	},
	execute: async function(data) {
		const author = data.member ? data.member.user : data.user
		if(!Config.bot.dev_ids.includes(author.id)) return {
			type: 4,
			data: {
				content: ":rage: Isso não foi feito pra você.",
				flags: 64
			}
		}
		const code = data.data.options[0].value
		try {
            const data = await util.inspect(await eval(code))
            if (typeof data !== 'string') data = require('util').inspect(data);
            let result = await clean(data)
			const response = {
				type: 4,
				data: {
					embeds: [
						{
							title: "Código processado.",
							description: `**Saída**\n\`\`\`js\n${result}\`\`\``,
							fields: [
								{
									name: "Entrada",
									value: `\`\`\`js\n${code}\`\`\``
								}
							]
						}
					]
				}
			}
			if(result.includes(process.env.BOT_TOKEN)) response.data.flags = 64;
			return response
		} catch(error) {
			const response = {
				type: 4,
				data: {
					embeds: [
						{
							title: "Aconteceu um erro.",
							description: `\`\`\`js\n${error}\`\`\``
						}
					]
				}
			}
			return response
		}
	}
}