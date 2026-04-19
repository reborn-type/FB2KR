const express = require('express');
const cors = require("cors");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const PORT = 3001;
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

let users = []

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API управления товарами в магазине одежды',
            version: '1.0.0',
            description: 'Простое API для управления товарами',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./src/api/script.js'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] [${res.statusCode} / ${req.path}]`)
        if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
            console.log("Body:", req.body)
        }
    });
    next();
})



app.get("/api/auth/me", authMiddleware, (req, res) => {
    const userId = req.user.sub; 
    const user = users.find(u => u.id === userId);;
    if (!user){
        return res.status(404).json({
            error: "User not found"
        });
    }

    res.status(200).json({id: user.id, email: user.email})
})



app.post("/api/auth/refresh", (req, res) => {
    const {refreshToken} = req.body;

    if(!refreshToken){
        return res.status(400).json({error: "refreshToken is required"});
    }

    if (!refreshTokens.has(refreshToken)) {
        return res.status(401).json({
            error: "Invalid refresh token",
        });
    }

    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = users.find((u) => u.id === payload.sub);
        if (!user) {
            return res.status(401).json({
                error: "User not found",
            });
        } 
        refreshTokens.delete(refreshToken);
        
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokens.add(newRefreshToken);
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
        } catch (err) {
            return res.status(401).json({
                error: "Invalid or expired refresh token",
            });
        }
});
 
app.use((req, res) => {
    res.status(404).json({error: "Not found"});
})

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({error: "Internal server error"});
})

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`)
})
