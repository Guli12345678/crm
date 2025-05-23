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

const addstudents = async (req, res) => {
  try {
    const { lid_id, first_name, last_name, phone_number, birthday, male } =
      req.body;
    const newStudents = await pool.query(
      `
      INSERT INTO students (lid_id, first_name,last_name, phone_number, birthday, male)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `,
      [lid_id, first_name, last_name, phone_number, birthday, male]
    );
    console.log({ newStudents: newStudents });
    res.status(201).send(newStudents.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllStudentss = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse: ", result);

    const studentss = await pool.query(`SELECT * FROM students`);
    res.status(200).send(studentss.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { lid_id, first_name, last_name, phone_number, birthday, male } =
      req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "students"
        SET lid_id=$1,
        first_name=$2,
        last_name=$3,
        phone_number=$4,
        birthday=$5,
        male = $6,
        where id = $7 
        RETURNING *`,
      [lid_id, first_name, last_name, phone_number, birthday, male, id]
    );
    res.send({ msg: "Students updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM students WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting students", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Students not found" });
        } else {
          res.status(200).send({ message: "Students deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addstudents, getAllStudentss, updateById, removeById };
