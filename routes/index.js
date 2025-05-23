const router = require("express").Router();

const stageRouter = require("./stage.routes");
const groupRouter = require("./group.routes");
const deviceRouter = require("./device.routes");
const branchRouter = require("./branch.routes");
const lid_statusRouter = require("./lid_status.routes");
const roleRouter = require("./role.routes");
const lidRouter = require("./lid.routes");
const reasonRouter = require("./reason.routes");
const paymentRouter = require("./payment.routes");
const studentsRouter = require("./students.routes");
const lessonRouter = require("./lesson.routes");
const student_groupRouter = require("./student_goup.routes");
const student_lessonRouter = require("./student_lesson.routes");

router.use("/stage", stageRouter);
router.use("/group", groupRouter);
router.use("/device", deviceRouter);
router.use("/status", lid_statusRouter);
router.use("/role", roleRouter);
router.use("/lid", lidRouter);
router.use("/branch", branchRouter);
router.use("/reason", reasonRouter);
router.use("/payment", paymentRouter);
router.use("/students", studentsRouter);
router.use("/student_lesson", student_lessonRouter);
router.use("/student_group", student_groupRouter);
router.use("/lesson", lessonRouter);

module.exports = router;
