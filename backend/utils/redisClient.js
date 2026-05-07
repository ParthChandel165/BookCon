const { createClient } = require("redis");

const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

client.on("ready", () => {
  console.log("Redis connected!");
});

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis!");
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  client,
  connectRedis,
};