const {
  addbranch,
  getAllBranchs,
  updateById,
  removeById
} = require("../controllers/branch.controller");

const router = require("express").Router();

router.post("/", addbranch);
router.post("/:id", updateById);
router.get("/", getAllBranchs);
router.delete("/", removeById);

module.exports = router;
