const express = require("express");
const router = express.Router();
const {
  criarCardapio,
  obterCardapio,
  atualizarCardapio,
} = require("../controllers/cardapioController");

router.post("/", criarCardapio);

router.get("/:pizzariaId", obterCardapio);

router.put("/:id", atualizarCardapio);

module.exports = router;
