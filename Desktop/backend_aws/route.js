const express = require('express');
const cors = require("cors");
const router = express.Router();
router.use(cors());


// Banco dados
const database = [];


// Rota raiz 
router.get('/', (req, res) => {
    res.send({
                "Title": "Projeto Tera - Plataforma de Ensino - Backend",
                "Module": "NodeJs, Express, AWS Amazon",
                "Author": "Tiago Silva",
                "Version": "0.8.0",
            });
})


// Cadastrar
router.post('/creat', (req, res) => {
    let user = req.body;
    database.push(user);
    res.status(201).send(user);
})


// Login
router.post('/login', (req, res) => {
    let userEmail = req.body.email;
    let userPswd = req.body.password;
    for (let user of database) {
        if (user['email'] == userEmail && user['password'] == userPswd) {
            res.status(200).send(user);
        } else {
            res.sendStatus(204);
        }
    }
})


// Atualizar
router.put('/update/:id', (req, res) => {
    let userId = req.params.id;
    let user = database[userId];
    user["name"] = req.body.name;
    user["email"] = req.body.email;
    user["password"] = req.body.password;
    database[userId] = user;
    res.status(200).send(user);
})


// Deletar
router.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    database[id] = {};
    res.status(204).send(database[id]);
})


module.exports = router