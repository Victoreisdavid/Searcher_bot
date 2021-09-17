module.exports = {
 message_flags: {
  EPHEMERAL: 64
 },
 command_type: {
  CHAT_INPUT: 1,
  USER: 2,
  MESSAGE: 3
 }
 callback_type: {
   PONG: 1,
   CHANNEL_MESSAGE_WITH_SOURCE: 4,
   DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
   DEFERRED_UPDATE_MESSAGE: 6,
   UPDATE_MESSAGE: 7
 }
}