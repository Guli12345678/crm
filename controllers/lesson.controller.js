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

const addlesson = async (req, res) => {
  try {
    const { lesson_theme, lesson_number, group_id, lesson_date } = req.body;
    const newLesson = await pool.query(
      `
      INSERT INTO lesson (lesson_theme, lesson_number, group_id, lesson_date)
      VALUES ($1, $2, $3, $4) RETURNING *
      `,
      [lesson_theme, lesson_number, group_id, lesson_date]
    );
    console.log({ newLesson: newLesson });
    res.status(201).send(newLesson.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllLessons = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse: ", result);
    const lessons = await pool.query(`SELECT * FROM lesson`);
    res.status(200).send(lessons.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { lesson_theme, lesson_number, group_id, lesson_date } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "lesson"
        SET lesson_theme = $1, lesson_number = $2, group_id = $3, lesson_date = $4 
        where id = $5 
        RETURNING *`,
      [lesson_theme, lesson_number, group_id, lesson_date, id]
    );
    res.send({ msg: "Lesson updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM lesson WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting lesson", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Lesson not found" });
        } else {
          res.status(200).send({ message: "Lesson deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addlesson, getAllLessons, updateById, removeById };
