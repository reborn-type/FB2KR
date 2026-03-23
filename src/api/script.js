const express = require('express');
const {nanoid} = require('nanoid');
const cors = require("cors");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const PORT = 3001;
const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, 'products.json');

const ACCESS_SECRET = "jwt_is_good"
const REFRESH_SECRET = "some_secret"

const ACCESS_EXPIRES_IN = "15m"
const REFRESH_EXPIRES_IN = "7d"

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

let users = []
const refreshTokens = new Set();


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

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.log('Ошибка загрузки данных, используем дефолтные');
    }
    return null;
}


function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка сохранения:', err);
    }
}

let products = loadData() || [ 
    {id: "abc123", name: "Кожанная куртка Guess", price: 12690, category: "jacket", description: "Материал: кожзам.", countInStock: 12},
    {id: "def232", name: "Куртка Homeless", price: 16990, category: "jacket", description: "Кол-во страз: 1000шт.", countInStock: 14}
];




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


function authMiddleware(req, res, next){
    const header = req.headers.authorization || "";
    
    const [scheme, token] = header.split(" ");

    if(scheme !== "Bearer" || !token){
        return res.status(401).json({error: "Missing or invalid autharization header."});
    }
    try { 
        const payload = jwt.verify(token, ACCESS_SECRET);
        req.user = payload;
        next();
    } catch(e) {
        return res.status(401).json({
            error: "Invalid or expired token",
        });
    }
}

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

/**
* @swagger
* components:
*   schemas:
*       Product:
*           type: object
*           required:
*               - name
*               - price
*               - category
*               - description
*               - countInStock
*           properties:
*               id:
*                   type: string
*                   description: Автоматически сгенерированный уникальный ID товара длиной в 6 символов
*               name:
*                   type: string
*                   description: Название вещи
*               price:
*                   type: integer
*                   description: Стоимость вещи
*               category:
*                   type: string
*                   description: Категория вещи 
*               desrciption:
*                   type: string
*                   description: Описание вещи 
*               countInStock:
*                   type: integet
*                   description: Кол-во вещей доступных на сайте
*               example:
*                   id: "abc123"
*                   name: Guess Hoodie
*                   price: 16232
*                   category: верхняя одежда
*                   description: Черное кожанное худи
*                   countInStock: 121
*/

function findUserOr404(userMail = null, userId = null, res = null){
    const user = users.find(u => u.email === userMail);
    if(userId !== 0){
        users.find(u => u.id === userId);
    }
    if (!user && res) { 
        res.status(404).json({error: "user not found"});
        return null;
    }
    return user;
}

function findProductOr404(id, res){
    const product = products.find(p => p.id == id);
    if(!product){
        res.status(404).json({error: "Product not found."});
        return null; 
    }
    return product;
}

async function hashPassword(password) {
    const rounds = 10; 
    return bcrypt.hash(password, rounds)
}

async function verifyPassword(password, passwordHash){
    return bcrypt.compare(password, passwordHash);
}


/**
* @swagger
* /api/auth/login:
*   post:
*     summary: Авторизация пользователя
*     description: Проверяет логин и пароль пользователя
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - first_name
*               - last_name
*               - password
*             properties:
*               email:
*                 type: string
*                 example: chicken@mail.ru 
*               first_name:
*                 type: string
*                 example: Ivan
*               last_name:
*                 type: string
*                 example: Ivanov
*               password:
*                 type: string
*                 example: qwerty123
*     responses:
*       200:
*         description: Успешная авторизация
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 login:
*                   type: boolean
*                   example: true
*       400:
*         description: Отсутствуют обязательные поля
*       401:
*         description: Неверные учетные данные
*       404:
*         description: Пользователь не найден
*/
app.post("/api/auth/login", async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "email and password are required"});
    }

    const user = users.find(u => u.email === email);;
    if(!user) return; 
    
    
    const isAuthentethicated = await verifyPassword(password, user.hashedPassword);
    if (isAuthentethicated){
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.add(refreshToken)
        res.status(200).json({accessToken, refreshToken});
    } else {
        res.status(401).json({ error: "not authentethicated" })
    }
})

app.post("/api/auth/register", async (req, res) => {
    const {email, first_name, last_name, password} = req.body;
    if(!email || !first_name || !last_name || !password){
        return res.status(400).json({ error: "Email, first name, last_name and password are required" });
    }

    const exists = users.some((u) => u.email === email);
        if (exists) {
            return res.status(409).json({
                error: "email already exists",
            });
        }

    const newUser = {
        id: nanoid(6),
        email: email, 
        first_name: first_name, 
        last_name: last_name,
        hashedPassword: await hashPassword(password)
    };


    users.push(newUser);
    res.status(201).json({user_id: newUser.id, first_name: newUser.first_name});
});


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


/**
* @swagger
* /api/products:
*   post:
*     summary: Создает новый товар
*     tags: [Products]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - name
*               - price          
*               - category
*               - description
*               - countInStock
*             properties:
*               name:
*                 type: string
*               price:
*                 type: integer
*               category:
*                 type: string
*               description:
*                 type: string
*               countInStock:
*                 type: integer
*     responses:
*       201:
*         description: Товар успешно создан
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Product'
*       400:
*         description: Ошибка в теле запроса
*/
app.post("/api/products", (req, res) => {
    const {name, price, description, countInStock, category} = req.body;
    if (!category) {
        return res.status(400).json({ error: 'Категория обязательна' });
    }
    const newProduct = {
        id: nanoid(5), 
        name: name.trim(),
        price: price, 
        category: category.trim(),
        description: description.trim(),
        countInStock: countInStock
    }
    saveData(products);
    res.status(201).json(newProduct)
});

/**
* @swagger
* /api/products:
*   get:
*       summary: Возвращает список всех товаров
*       tags: [Products]
*       responses:
*           200:
*               description: Список товаров
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: '#/components/schemas/Product'
*/
app.get("/api/products", (req,res) => {
    res.json(products);
})

/**
* @swagger
* /api/products/{id}:
*   get:
*       summary: Получает товара по ID
*       tags: [Products]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: ID товара
*       responses:
*           200:
*               description: Данные товара
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Product'
*           404:
*               description: Товар не найден
*/
app.get("/api/products/:id", authMiddleware, (req, res) => {
    const usId = req.user.sub;
    const user = users.find(u => u.id === usId);;
    if(!user){ 
        res.status(404).json({
            error: "User not found",
        }); 
        return;
    }
    const id = req.params.id; 
    const product = findProductOr404(id, res); 
    if(!product) {
        res.status(404).json("incorrect id or doesn't exist")
        return;
    }
    res.status(200).json(product); 
});

/**
* @swagger
* /api/products/{id}:
*   patch:
*       summary: Обновляет данные товара
*       tags: [Products]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: ID товара
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: object
*                       properties:
*                           name:
*                               type: string
*                           price:
*                               type: integer
*                           category:
*                               type: string
*                           description:
*                               type: string
*                           countInStock:
*                               type: string
*       responses:
*           200:
*               description: Обновленный товар
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Product'
*           400:
*               description: Нет данных для обновления
*           404:
*               description: Товар не найден
*/
app.patch("/api/products/:id", authMiddleware ,(req, res) => {
    const usId = req.user.sub;
    const user = users.find(u => u.id === usId);;
    if(!user){ 
        res.status(404).json({
            error: "User not found",
        }); 
        return;
    }
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) {
        res.status(404).json("incorrect id or doesn't exist")
        return;
    }
    if(req.body?.name === undefined && req.body?.price === undefined && req.body?.category === undefined && req.body?.description === undefined &&  req.body?.countInStock === undefined){
        return res.status(400).json({
            error: "Nothing to update",
        });
    }
    const {name, price, category, description, countInStock} = req.body;
    if(name !== undefined) product.name = name;
    if(price !== undefined) product.price = price;
    if(category !== undefined) product.category = category;
    if(description !== undefined) product.description = description;
    if(countInStock !== undefined) product.countInStock = countInStock;
    saveData(products);
    res.json(product)
})


/**
* @swagger
* /api/products/{id}:
*   delete:
*       summary: Удаляет товар
*       tags: [Products]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: ID товара
*       responses:
*           204:
*               description: Товар успешно удален (нет тела ответа)
*           404:
*               description: Товар не найден
*/
app.delete("/api/products/:id", authMiddleware,(req, res) => {
    const usId = req.user.sub;
    const user = users.find(u => u.id === usId);;
    if(!user){ 
        res.status(404).json({
            error: "User not found",
        }); 
        return;
    }
    const id = req.params.id; 
    const exists = products.some((p) => p.id === id)
    if(!exists) return res.status(404).json({error: "Product not found"});

    products = products.filter(p => p.id !== id);
    saveData(products);
    res.status(204).send();
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
