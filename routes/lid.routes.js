const {
  addlid,
  getAllLids,
  updateById,
  removeById,
} = require("../controllers/lid.controller");

const router = require("express").Router();

router.post("/", addlid);
router.post("/:id", updateById);
router.get("/", getAllLids);
router.delete("/:id", removeById);

module.exports = router;
