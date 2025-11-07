const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

router.post("/", pedidoController.criarPedido);

router.get("/", pedidoController.listarPedidos);

router.get("/pizzaria/:pizzariaId/", pedidoController.listarPedidosPorPizzaria);

router.patch("/entrega/:id", pedidoController.atualizarEntrega);

module.exports = router;
