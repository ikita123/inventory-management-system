const { getRedisClient } = require("../config/redisClient");

exports.clearInventoryCache = async () => {
  const redis = getRedisClient();
  await redis.del("inventory");
};
