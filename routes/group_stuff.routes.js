const {
  addgroup_stuff,
  getAllgroup_stuffs,
  updateById,
  removeById,
} = require("../controllers/group_stuff.controller");

const router = require("express").Router();

router.post("/", addgroup_stuff);
router.get("/", getAllgroup_stuffs);
router.patch("/", updateById);
router.delete("/:id", removeById);

module.exports = router;
