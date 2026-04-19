const { redisClient } = require('../config/redis');

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; 

const saveRefreshToken = async (email, refreshToken) => {
    const key = `rf_token:${refreshToken}`;

    await redisClient.set(key, email, {
        EX: REFRESH_TOKEN_TTL
    });
};

const getUserIdByToken = async (token) => {
    const key = `rf_token:${token}`;
    return await redisClient.get(key);
};

const deleteToken = async (token) => {
    const key = `rf_token:${token}`;
    await redisClient.del(key);
};

module.exports = { saveRefreshToken, getUserIdByToken, deleteToken };