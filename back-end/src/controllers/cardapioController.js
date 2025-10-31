const Cardapio = require("../models/Cardapio");

exports.criarCardapio = async (req, res) => {
  try {
    const { userId, categorias } = req.body;

    const novoCardapio = new Cardapio({ userId, categorias });
    await novoCardapio.save();

    res.status(201).json(novoCardapio);
  } catch (error) {
    console.error("Erro ao criar cardápio:", error);
    res.status(500).json({ error: "Erro ao criar cardápio." });
  }
};

exports.obterCardapio = async (req, res) => {
  try {
    const { userId } = req.params;
    const numericUserId = Number(userId);

    const cardapio = await Cardapio.findOne({ userID: numericUserId });

    if (!cardapio) {
      return res.status(404).json({ message: "Cardápio não encontrado." });
    }

    res.json(cardapio);
  } catch (error) {
    console.error("Erro ao buscar cardápio:", error);
    res.status(500).json({ error: "Erro ao buscar cardápio." });
  }
};


exports.atualizarCardapio = async (req, res) => {
  try {
    const { id } = req.params;
    const novosDados = req.body;

    const cardapioAtualizado = await Cardapio.findByIdAndUpdate(
      id,
      { $set: novosDados, ultimaAtualizacao: Date.now() },
      { new: true }
    );

    if (!cardapioAtualizado) {
      return res.status(404).json({ message: "Cardápio não encontrado." });
    }

    res.json(cardapioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar cardápio:", error);
    res.status(500).json({ error: "Erro ao atualizar cardápio." });
  }
};
