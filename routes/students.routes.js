const {
  addstudents,
  getAllStudentss,
  updateById,
  removeById,
} = require("../controllers/students.controller");

const router = require("express").Router();

router.post("/", addstudents);
router.post("/:id", updateById);
router.get("/", getAllStudentss);
router.delete("/:id", removeById);

module.exports = router;
