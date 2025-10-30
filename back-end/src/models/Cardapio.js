const mongoose = require("mongoose");

const CardapioSchema = new mongoose.Schema({
  categorias: [
    {
      nome: String,
      pizzas: [
        {
          nome: String,
          descricao: String,
          precoPequena: Number,
          precoMedia: Number,
          precoGrande: Number,
          imagem: String,
          destaque: Boolean,
          disponivel: Boolean,
        },
      ],
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ultimaAtualizacao: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Cardapio", CardapioSchema);
