const express = require('express');
const app = express();

app.use(express.json());

app.use(require('./router'));

app.get('/', (req, res) => { 
    res.send("Welcome");
})

const PORT = process.env.PORT || 8000;
app.listen(PORT);