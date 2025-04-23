const express = require("express");
const router = express.Router();
const Controller = require("./controller.js");

router.get("/", Controller.getMain);
router.get("/api/Fruits", Controller.getFruits);
router.get("/api/Games", Controller.getGames);
router.get("/api/Food", Controller.getRecipes);
router.get("/api/combined-data", Controller.getMix);
router.get("/:anything", Controller.getNotFound);

module.exports = router;
