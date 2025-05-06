const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'UupGSE1H8aGgARsRKk7pzbfG1NIHrtb1',
    socket: {
        host: 'redis-13203.c309.us-east-2-1.ec2.redns.redis-cloud.com',
        port: 13203
    }
});

client.on('error', err => {
    console.error('Redis Client Error:', err);
});

client.on('connect', () => {
    console.log('Redis client is connecting...');
});

client.on('ready', () => {
    console.log('Redis client connected and ready to use!');
});

const connectRedis = async () => {
    try {
        await client.connect();
        console.log('✅ Connected to Redis!');
    } catch (err) {
        console.error('❌ Error while connecting to Redis:', err);
    }
};

module.exports = {
    client,
    connectRedis
};
