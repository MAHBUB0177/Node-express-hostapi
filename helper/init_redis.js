// helper/init_redis.js
const Redis = require("ioredis");

const client = new Redis({
    port: 10096, // Redis port
    host: "redis-10096.c281.us-east-1-2.ec2.redns.redis-cloud.com", // Redis host
    username: "default", // needs Redis >= 6
    password: "XwCqAk79C3wKk54RakqV2ZCRSQ9olRM7",
});

client.on('connect', () => {
    console.log('Client connected to Redis...');
});

client.on('ready', () => {
    console.log('Client ready to use Redis...');
});

client.on('end', () => {
    console.log('Client disconnected from Redis...');
});

client.on('error', (err) => {
    console.log('Redis error:', err.message);
});

process.on('SIGINT', () => {
    client.quit(() => {
        console.log('Redis client disconnected through app termination');
        process.exit(0);
    });
});

module.exports = client;
