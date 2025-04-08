const redis = require("redis");

let redisClient;
const redisConnect = async () => {
  redisClient = redis.createClient({ url: process.env.REDIS_URL });
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis: redisConnect, getRedisClient };
