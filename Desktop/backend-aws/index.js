const express = require('express');
const router = require('./route');

const app = express();
const port = 5000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log(`Ativo na porta ${port}`)
})