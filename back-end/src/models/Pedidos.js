const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PedidoSchema = new Schema({
  cliente: {
    nome: { type: String, required: true },
    endereco: { type: String, required: true },
    telefone: { type: String, required: true },
    cpf: { type: String, required: true },
    formaPagamento: {
      type: String,
      enum: ["pix", "dinheiro", "cartão"],
      required: true
    }
  },
  itens: [
    {
      pizzaId: { type: Schema.Types.ObjectId, ref: "Pizza", required: true },
      quantidade: { type: Number, required: true, default: 1 }
    }
  ],

  total: { type: Number, required: true },
  pizzariaId: { type: Schema.Types.ObjectId, ref: "Pizzaria", required: true },
  createdAt: { type: Date, default: Date.now },
  entregue: { type: Boolean, default: false }
});

// Evita recriar o model se já existir (útil em hot reload)
const Pedido = mongoose.models.Pedido || model("Pedido", PedidoSchema);

module.exports = Pedido;
