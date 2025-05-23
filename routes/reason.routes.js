const {
  addreason,
  getAllReasons,
  updateById,
  removeById,
} = require("../controllers/reason.controller");

const router = require("express").Router();

router.post("/", addreason);
router.post("/:id", updateById);
router.get("/", getAllReasons);
router.delete("/:id", removeById);

module.exports = router;
