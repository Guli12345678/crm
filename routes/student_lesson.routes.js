const {
  addstudent_lesson,
  getAllStudent_lessons,
  updateById,
  removeById,
} = require("../controllers/student_lesson.controller");

const router = require("express").Router();

router.post("/", addstudent_lesson);
router.post("/:id", updateById);
router.get("/", getAllStudent_lessons);
router.delete("/:id", removeById);

module.exports = router;
