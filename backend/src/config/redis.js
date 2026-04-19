const { createClient } = require('redis');

const redisClient = createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', err => console.error('Ошибка Redis:', err));

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Redis подключен');
    }
};

module.exports = { redisClient, connectRedis };
