const DeviceDetector = require("node-device-detector");
const { sendErrorResponse } = require("../helpers/send_error_res");
const pool = require("../config/db");
const DeviceHelper = require("node-device-detector/helper");

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  osIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});

const addstudent_lesson = async (req, res) => {
  try {
    const { lesson_id, student_id, is_there, reason, be_paid } = req.body;
    const newStudent_lesson = await pool.query(
      `
      INSERT INTO student_lesson (lesson_id, student_id, is_there, reason, be_paid)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
      `,
      [lesson_id, student_id, is_there, reason, be_paid]
    );
    console.log({ newStudent_lesson: newStudent_lesson });
    res.status(201).send(newStudent_lesson.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllStudent_lessons = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse: ", result);
    const student_lessons = await pool.query(`SELECT * FROM student_lesson`);
    res.status(200).send(student_lessons.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { lesson_id, student_id, is_there, reason, be_paid } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "student_lesson"
        SET lesson_id = $1, student_id = $2, is_there = $3, reason = $4, be_paid = $5 
        where id = $6 
        RETURNING *`,
      [lesson_id, student_id, is_there, reason, be_paid, id]
    );
    res.send({ msg: "Student_lesson updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM student_lesson WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res.status(500).send({
            message: "Error deleting student_lesson",
            error: err.message,
          });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Student_lesson not found" });
        } else {
          res
            .status(200)
            .send({ message: "Student_lesson deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = {
  addstudent_lesson,
  getAllStudent_lessons,
  updateById,
  removeById,
};
