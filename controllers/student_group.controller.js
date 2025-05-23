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

const addstudent_group = async (req, res) => {
  try {
    const { student_id, group_id } = req.body;
    const newStudent_group = await pool.query(
      `
      INSERT INTO student_group (student_id, group_id)
      VALUES ($1, $2) RETURNING *
      `,
      [student_id, group_id]
    );
    console.log({ newStudent_group: newStudent_group });
    res.status(201).send(newStudent_group.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllStudent_groups = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse: ", result);
    const student_groups = await pool.query(`SELECT * FROM student_group`);
    res.status(200).send(student_groups.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { student_id, group_id } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "student_group"
        SET student_id=$1, group_id = $2  
        where id = $3 
        RETURNING *`,
      [student_id, group_id]
    );
    res.send({ msg: "Student_group updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM student_group WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res.status(500).send({
            message: "Error deleting student_group",
            error: err.message,
          });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Student_group not found" });
        } else {
          res
            .status(200)
            .send({ message: "Student_group deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = {
  addstudent_group,
  getAllStudent_groups,
  updateById,
  removeById,
};
