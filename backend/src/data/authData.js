const { redisClient } = require('../config/redis');

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; 

const saveRefreshToken = async (email, refreshToken) => {
    const key = `rf_token:${email}`;

    try{
        const result = await redisClient.set(key, refreshToken, {
            EX: REFRESH_TOKEN_TTL,
        });
        if (result === null) {
            console.log(`Рефреш токен для ${email} успешно обновлен.`);
            return false; 
        } return true; 
    } catch (err) {
        console.error('Ошибка записи в Redis:', err);
        throw err;
    }
};

const getUserIdByToken = async (token) => {
    try {
        const key = `rf_token:${token}`;
        const data = await redisClient.get(key);
        return data; 
    } catch (err) {
        console.error('Ошибка чтения из Redis:', err);
        return null;
    }
};

const deleteToken = async (token) => {
    const key = `rf_token:${token}`;
    await redisClient.del(key);
};

module.exports = { saveRefreshToken, getUserIdByToken, deleteToken };