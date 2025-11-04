const mongoose = require("mongoose");
const Pizzaria = require("../models/Pizzaria");

exports.createPizzaria = async (req, res) => {
  const pizzaria = new Pizzaria(req.body);
  await pizzaria.save();
  res.status(201).json(pizzaria);
};

exports.softDeletePizzaria = async (req, res) => {
  try {
    const { id } = req.params;
    const pizzaria = await Pizzaria.findById(id);

    if (!pizzaria) {
      return res.status(404).json({ error: "Pizzaria não encontrada" });
    }

    // Marca como deletada
    pizzaria.deleted = true;
    pizzaria.deletedAt = new Date();
    await pizzaria.save();

    res.status(200).json({ message: "Pizzaria marcada como deletada com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar pizzaria." });
  }
};


exports.updatePizzaria = async (req, res) => {
  try {
    const { cardapioId, ...rest } = req.body;

    const updateData = { ...rest };
    if (cardapioId) updateData.cardapioId = new mongoose.Types.ObjectId(cardapioId);

    const updated = await Pizzaria.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar pizzaria" });
  }
};

exports.getPizzarias = async (req, res) => {
  const pizzarias = await Pizzaria.find({ deleted: false }).populate("userId");
  res.json(pizzarias);
};

exports.getPizzariaById = async (req, res) => {
  const { id } = req.params;
  const pizzaria = await Pizzaria.findOne({ _id: id, deleted: false }).populate("userId");
  if (!pizzaria) {
    return res.status(404).json({ error: "Pizzaria não encontrada ou deletada." });
  }
  res.json(pizzaria);
};

