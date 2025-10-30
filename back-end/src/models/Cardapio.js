const mongoose = require("mongoose");

const CardapioSchema = new mongoose.Schema({
  pizzariaId: { type: mongoose.Schema.Types.ObjectId, ref: "Pizzaria", required: true },
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
  ultimaAtualizacao: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cardapio", CardapioSchema);
