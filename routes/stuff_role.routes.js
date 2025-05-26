const {
  addstuff_role,
  getAllstuff_roles,
  updateById,
  removeById,
} = require("../controllers/stuff_role.controller");

const router = require("express").Router();

router.post("/", addstuff_role);
router.get("/", getAllstuff_roles);
router.patch("/", updateById);
router.delete("/:id", removeById);

module.exports = router;
