const {
  addstuff,
  getAllStuffs,
  updateById,
  removeById,
} = require("../controllers/stuff.controller");

const router = require("express").Router();

router.post("/", addstuff);
router.post("/:id", updateById);
router.get("/", getAllStuffs);
router.delete("/:id", removeById);

module.exports = router;
