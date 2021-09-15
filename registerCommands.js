/*
	Se for colocar um ID, coloque um válido e que o bot esteja no servidor.
*/
const guild_id = process.argv[2]
console.log(`Registrando em`, guild_id == undefined ? "todos os servidores" : guild_id)
require("./src/utils/registers/commands")(guild_id)