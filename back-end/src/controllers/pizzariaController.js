const mongoose = require("mongoose");
const Pizzaria = require("../models/Pizzaria");

exports.createPizzaria = async (req, res) => {
  const pizzaria = new Pizzaria(req.body);
  await pizzaria.save();
  res.status(201).json(pizzaria);
};

export const updatePizzaria = async (req, res) => {
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
  const pizzarias = await Pizzaria.find().populate("userId");
  res.json(pizzarias);
};

exports.getPizzariaById = async (req, res) => {
  const { id } = req.params;
  const pizzaria = await Pizzaria.findById(id).populate("userId");
  res.json(pizzaria);
};
