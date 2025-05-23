const {
  addlesson,
  getAllLessons,
  updateById,
  removeById,
} = require("../controllers/lesson.controller");

const router = require("express").Router();

router.post("/", addlesson);
router.post("/:id", updateById);
router.get("/", getAllLessons);
router.delete("/:id", removeById);

module.exports = router;
