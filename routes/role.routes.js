const {
  addrole,
  getAllRoles,
  updateById,
  removeById
} = require("../controllers/role.controller");

const router = require("express").Router();

router.post("/", addrole);
router.post("/:id", updateById);
router.get("/", getAllRoles);
router.delete("/:id", removeById);

module.exports = router;
