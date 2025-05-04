const redis = require('redis');

const client = redis.createClient({
  username: 'default',
  password: 'UupGSE1H8aGgARsRKk7pzbfG1NIHrtb1',
  socket: {
    host: 'redis-13203.c309.us-east-2-1.ec2.redns.redis-cloud.com',
    port: 13203
  }
});

client.on('error', err => console.log('Redis Client Error', err));

async function connectRedis() {
  await client.connect();
  await client.set('foo', 'bar');
  const result = await client.get('foo');
  console.log(result);
}

module.exports = { connectRedis };
