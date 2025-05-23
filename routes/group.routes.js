const {
  addGroup,
  getAllGroups,
  updateById,
  removeById
} = require("../controllers/group.controller");

const router = require("express").Router();

router.post("/", addGroup);
router.post("/:id", updateById);
router.get("/", getAllGroups);
router.delete("/:id", removeById);

module.exports = router;
