module.exports = {
 command: {
  name: "ping",
  description: "Ping?",
  type: 1
 },
 execute: async function(data) {
 return {
  type: 4,
  data: {
   content: ":ping_pong: Pong!"
   }
  }
 }
}