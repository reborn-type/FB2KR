const {getAllUsers, 
    getUserById, 
    createUser, 
    patchUserById, 
    deleteUserById, 
    getUserByEmail} = require('../data/usersData');
const {nanoid} = require('nanoid');

async function getUsers(req, res) {
    try {
        const users = await getAllUsers();
        if(!users){
            res.status(404).json({"error message": "Пользователи не найдены."});
        }
        res.json(users);
    }
    catch (e){
        res.status(400).send("Ошибка сервера.");
    }
}

async function getUser(req, res) {
    try{
        const id = req.params.id;
        const user = await getUserById(id);

        if(!user){
            return res.status(404).json({"error message": "Пользователь с таким ID не найден."});
        }
    }
    catch (e){
        res.status(400).send("Ошибка сервера.");
    }
}

async function getUserWithEmail(req, res) {
    try{
        const email = req.params.email;
        const user = await getUserByEmail(email);
        
        if(!user){
            return res.status(404).json({"error message": "Пользователь с таким email не найден."});
        }
    }
    catch (e){
        res.status(400).send("Ошибка сервера.");
    }
};

async function postUser(req, res) {
    try {
        const { username, email, passwordHash} = req.body;
        const user = await createUser(nanoid(5), username, email, passwordHash);
        if(!user){
            return res.status(400).json({"error message": "Пользователь не был создан."});
        }
        res.status(201).json(user);
    }
    catch (e){
        res.status(400).send("Ошибка сервера.");
    }
}

async function patchUserWithId(req, res) {
    try {
        const id = req.params.id;
        const {name, email, passwordHash} = req.body;
        const user = await patchUserById(id, name, email, passwordHash);
        if(!user){
            return res.status(404).json({"error message": "Пользователь с таким ID не найден."});
        }
        res.json(user);
    }
    catch (e){
        res.status(400).send("Ошибка сервера.");
    }
}

async function deleteUserWithId(req, res) {
    try {
        const id = req.params.id;
        const user = await deleteUserById(id);
        if(!user){
            return res.status(404).json({"error message": "Пользователь с таким ID не найден."});
        }
        res.json(user);
    }
    catch (e){
        res.status(400).send("Ошибка сервера.");
    }
}

module.exports = {
    getUsers,
    getUser,
    postUser,
    patchUserWithId,
    deleteUserWithId,
    getUserWithEmail,
};