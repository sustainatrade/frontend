const Redis = require("ioredis");
const config = require("./../config");
const redis = new Redis(config.redis.port, config.redis.host);

module.exports = redis;
