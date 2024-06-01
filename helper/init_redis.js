const redis = require('redis');

const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1',
    legacyMode: true,
});
client.connect().catch(console.error,'+++++++++++++++')
client.on('connect', () => {
    console.log('client connected to redis...');
});

client.on('ready', () => {
    console.log('client ready to connected...');
});

client.on('end', () => {
    console.log('client disconnected from redis...');
});

client.on('error', (err) => {
    console.log('Redis error:', err.message);
});

//when application shut down redis client close this is very good  practice from our application

process.on('SIGINT', () => {
    client.quit();
    process.exit();
});


module.exports=client

