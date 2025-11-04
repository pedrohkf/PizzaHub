const express = require("express");
const router = express.Router();
const pizzariaController = require("../controllers/pizzariaController");

router.post("/create", pizzariaController.createPizzaria);
router.post("/delete/:id", pizzariaController.softDeletePizzaria);
router.put("/update/:id", pizzariaController.updatePizzaria);
router.get("/get", pizzariaController.getPizzarias);
router.get("/get/:id", pizzariaController.getPizzariaById);

module.exports = router;
