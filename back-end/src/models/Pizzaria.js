const mongoose = require("mongoose");

const PizzariaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  openingHours: { type: String, required: true },
  numberHouse: { type: String, required: true },
  street: { type: String, required: true },
  neighborhood: { type: String, required: true },
  state: { type: String, required: true },
  deliveryFee: { type: String, required: true },
  methodPay: {
    type: String,
    enum: ["dinheiro", "pix", "cartão"],
    required: true,
  },

  logo: { type: String, default: "" },
  bannerImage: { type: String, default: "" },
  gallery: { type: [String], default: [] },
  slogan: { type: String, default: "" },
  description: { type: String, default: "" },

  socialLinks: {
    instagram: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    website: { type: String, default: "" },
  },

  userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pizzaria", PizzariaSchema);
