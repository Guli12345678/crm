const {
  addstage,
  getAllStages,
  updateById,
  removeById,
} = require("../controllers/stage.controller");

const router = require("express").Router();

router.post("/", addstage);
router.post("/:id", updateById);
router.get("/", getAllStages);
router.delete("/:id", removeById);

module.exports = router;
