const mongoose = require("mongoose");

const PizzariaSchema = new mongoose.Schema({
  name: { type: String, required: false },
  phone: { type: String, required: true },
  openingHours: { type: String, required: true },
  numberHouse: { type: String, required: true },
  street: { type: String, required: false },
  neighborhood: { type: String, required: true },
  state: { type: String, required: true },
  deliveryFee: { type: String, required: true },
  methodPay: {
    type: String,
    enum: ["dinheiro", "pix", "cartão"],
    required: true,
  },

  logo: { type: String },
  bannerImage: { type: String },
  gallery: [{ type: String }],
  slogan: { type: String },
  description: { type: String },

  socialLinks: {
    instagram: { type: String },
    whatsapp: { type: String },
    website: { type: String },
  },

  userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  menuId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],

  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pizzaria", PizzariaSchema);
