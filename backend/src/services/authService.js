const usersData = require('../data/usersData');
const authUtils = require('../utils/authUtils');
const authData = require('../data/authData');

const register = async ({email, first_name, last_name, password}) => {
    const existingUser = await usersData.getUserByEmail(email);
    if (existingUser) {
        throw new Error('Email already exists');
    }
    
    const hashedPassword = await authUtils.hashPassword(password);
    const newUser = await usersData.createUser(first_name, last_name, email, hashedPassword);
    return newUser;
};

const login = async ({email, password}) => {
    const user = await usersData.getUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    
    const isPasswordValid = await authUtils.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    
    const accessToken = authUtils.generateAccessToken(user);
    const refreshToken = authUtils.generateRefreshToken(user);
    await authData.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
};

const authMe = async (email) => {
    const user = await usersData.getUserByEmail(email);

    if (!user){
        throw new Error('User not found');
    }

    return {first_name: user.first_name, last_name: user.last_name, email: user.email};
}

const refreshTokens = async (refreshToken) => {

    if(!refreshToken){
        return res.status(400).json({error: "refreshToken is required"});
    }

    if (!authData.isRefreshTokenValid(refreshToken)) {
        return res.status(401).json({
            error: "Invalid refresh token",
        });
    }

    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = usersData.getUserByEmail(payload.sub);
        if (!user) {
            return res.status(401).json({
                error: "User not found",
            });
        } 
        await authData.deleteToken(refreshToken);
        
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        await authData.saveRefreshToken(newRefreshToken, email);
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
        } catch (err) {
            return res.status(401).json({
                error: "Invalid or expired refresh token",
            });
        }
}

module.exports = {
    register,
    login,
    authMe
};

