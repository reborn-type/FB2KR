const {getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser} = require('../data/usersData');


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

async function postUser(req, res) {
    try {
        const {name, email, passwordHash} = req.body;
        const user = await createUser(name, email, passwordHash);
        if(!user){
            return res.status(400).json({"error message": "Пользователь не был создан."});
        }
        res.status(201).json(user);
    }
    catch (e){
        res.status(400).send("Ошибка сервера.");
    }
}

async function patchUser(req, res) {
    try {
        const id = req.params.id;
        const {name, email, passwordHash} = req.body;
        const user = await updateUser(id, name, email, passwordHash);
        if(!user){
            return res.status(404).json({"error message": "Пользователь с таким ID не найден."});
        }
        res.json(user);
    }
    catch (e){
        res.status(400).send("Ошибка сервера.");
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const user = await deleteUser(id);
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
    patchUser,
    deleteUser
};