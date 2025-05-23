const {
  addstudent_group,
  getAllStudent_groups,
  updateById,
  removeById,
} = require("../controllers/student_group.controller");

const router = require("express").Router();

router.post("/", addstudent_group);
router.post("/:id", updateById);
router.get("/", getAllStudent_groups);
router.delete("/:id", removeById);

module.exports = router;
