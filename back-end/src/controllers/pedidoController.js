const Pedido = require("../models/Pedidos");
const Cardapio = require("../models/Cardapio");

exports.criarPedido = async (req, res) => {
  try {
    const { cliente, itens, total, pizzariaId } = req.body;

    if (!cliente || !itens || !total || !pizzariaId) {
      return res.status(400).json({ message: "Campos obrigatórios faltando!" });
    }

    const pedido = new Pedido({
      cliente,
      itens,
      total,
      pizzariaId
    });

    await pedido.save();
    res.status(201).json({ message: "Pedido criado com sucesso!", pedido });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar pedido" });
  }
};

exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar pedidos" });
  }
};

exports.listarPedidosPorPizzaria = async (req, res) => {
  try {
    const { pizzariaId } = req.params;

    const pedidos = await Pedido.find({ pizzariaId });
    const cardapio = await Cardapio.findOne({ userId: pizzariaId }).lean();

    if (!cardapio) {
      return res.status(404).json({ message: "Cardápio não encontrado para essa pizzaria." });
    }

    if (!cardapio.categorias || !Array.isArray(cardapio.categorias)) {
      return res.status(400).json({ message: "Cardápio sem categorias cadastradas." });
    }

    const pedidosComPizzas = pedidos.map(pedido => ({
      ...pedido,
      itens: pedido.itens.map(item => {
        const categoria = cardapio.categorias.find(c =>
          c.pizzas?.some(p => String(p._id) === String(item.pizzaId))
        );
        const pizza = categoria?.pizzas?.find(p => String(p._id) === String(item.pizzaId));
        return { ...item, pizza };
      })
    }));

    res.json(pedidosComPizzas);

  } catch (err) {
    console.error("Erro ao listar pedidos:", err);
    res.status(500).json({ message: "Erro ao listar pedidos da pizzaria" });
  }
};


exports.atualizarEntrega = async (req, res) => {
  try {
    const { id } = req.params;
    const { entregue } = req.body;

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { entregue },
      { new: true }
    );

    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    res.json({ message: "Status atualizado com sucesso", pedido });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar pedido" });
  }
};
