import { createClient } from 'redis';

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

try {
    await client.connect();

    console.log('Connected to Redis. Setting key...');
    await client.set('foo', 'bar');

    const result = await client.get('foo');
    console.log('Retrieved value from Redis:', result);  // >>> bar
} catch (err) {
    console.error('Error while connecting to or interacting with Redis:', err);
}