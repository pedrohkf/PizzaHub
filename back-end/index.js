const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const pizzariaRoutes = require('./src/routes/pizzariaRoutes');
const cardapioRoutes = require('./src/routes/cardapioRoutes');

require('dotenv').config();
const app = express();

app.use(cors());

app.use(express.json());
app.use('/auth', authRoutes);
app.use("/api/pizzarias", pizzariaRoutes);
app.use("/api/cardapio", cardapioRoutes)


app.get("/", (req, res) => {
    res.send("Hello, world!");
});

const port = process.env.PORT || 2700;

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conexão com MongoDB"))
    .catch((error) => console.log("Erro na conexão com MongoDB:", error.message));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;