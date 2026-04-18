
// по хорошему запихнуть в env
const ACCESS_SECRET = "jwt_is_good"
const REFRESH_SECRET = "some_secret"

const ACCESS_EXPIRES_IN = "15m"
const REFRESH_EXPIRES_IN = "7d"



function generateAccessToken(user) {
return jwt.sign(
    {
        sub: user.id,
        username: user.username,
    },
ACCESS_SECRET,
    {
        expiresIn: ACCESS_EXPIRES_IN,
    }
)};

function generateRefreshToken(user) {
return jwt.sign(
{
    sub: user.id,
    username: user.username,
},
REFRESH_SECRET,
{
    expiresIn: REFRESH_EXPIRES_IN,
}
);
}


async function hashPassword(password) {
    const rounds = 10; 
    return bcrypt.hash(password, rounds)
}

async function verifyPassword(password, passwordHash){
    return bcrypt.compare(password, passwordHash);
}