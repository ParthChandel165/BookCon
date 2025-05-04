const { createClient } = require('redis');

// Configure Redis connection options (can be extended to use env variables)
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => console.error('Redis Client Error:', err));

async function connectRedis() {
  if (!client.isOpen) {
    try {
      await client.connect();
      console.log(' Redis connected successfully');
    } catch (err) {
      console.error(' Redis connection failed:', err);
    }
  }
}

module.exports = { client, connectRedis };
