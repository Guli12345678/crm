const {
  addlidStatus,
  getAllLidStatuss,
  updateById,
  removeById
} = require("../controllers/lid_status.controller");

const router = require("express").Router();

router.post("/", addlidStatus);
router.post("/:id", updateById);
router.get("/", getAllLidStatuss);
router.delete("/:id", removeById);

module.exports = router;
