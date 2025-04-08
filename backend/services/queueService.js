const { getChannel } = require("../config/rabbitmq");

exports.processQueue = () => {
  const channel = getChannel();
  channel.consume("inventory_updates", async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      console.log("Processing queue message:", content);
      channel.ack(msg);
    }
  });
};
