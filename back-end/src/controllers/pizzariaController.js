const Pizzaria = require("../models/Pizzaria");

exports.createPizzaria = async (req, res) => {
  const pizzaria = new Pizzaria(req.body);
  await pizzaria.save();
  res.status(201).json(pizzaria);
};

exports.updatePizzaria = async (req, res) => {
  const { id } = req.params;
  const updated = await Pizzaria.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

exports.getPizzarias = async (req, res) => {
  const pizzarias = await Pizzaria.find().populate("menuId userId");
  res.json(pizzarias);
};

exports.getPizzariaById = async (req, res) => {
  const { id } = req.params;
  const pizzaria = await Pizzaria.findById(id).populate("menuId userId");
  res.json(pizzaria);
};
