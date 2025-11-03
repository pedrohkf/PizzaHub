const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

// Criar pedido
router.post("/", pedidoController.criarPedido);

// Listar todos os pedidos
router.get("/", pedidoController.listarPedidos);

// Listar pedidos de uma pizzaria específica
router.get("/pizzaria/:pizzariaId", pedidoController.listarPedidosPorPizzaria);

// Atualizar status de entrega
router.patch("/entrega/:id", pedidoController.atualizarEntrega);

module.exports = router;
