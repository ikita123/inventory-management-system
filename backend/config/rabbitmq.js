const amqp = require("amqplib");

let channel;
const connectQueue = async () => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue("inventory_updates");
  console.log("Connected to RabbitMQ");
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ: connectQueue, getChannel };
