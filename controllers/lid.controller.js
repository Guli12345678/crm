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

const addlid = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      target_id,
      lid_stage_id,
      test_date,
      trial_lesson_date,
      trial_lesson_time,
      trial_lesson_group_id,
      lid_status_id,
      cancel_reason_id,
    } = req.body;
    const newLid = await pool.query(
      `
      INSERT INTO lid (
      first_name,
      last_name,
      phone_number,
      target_id,
      lid_stage_id,
      test_date,
      trial_lesson_date,
      trial_lesson_time,
      trial_lesson_group_id,
      lid_status_id,
      cancel_reason_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
      `,
      [
        first_name,
        last_name,
        phone_number,
        target_id,
        lid_stage_id,
        test_date,
        trial_lesson_date,
        trial_lesson_time,
        trial_lesson_group_id,
        lid_status_id,
        cancel_reason_id,
      ]
    );
    console.log({ newLid: newLid });
    res.status(201).send(newLid.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllLids = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse: ", result);
    console.log(DeviceHelper.isSmartphone(result));
    console.log(DeviceHelper.isMobile(result));
    console.log(DeviceHelper.isDesktop(result));
    console.log(DeviceHelper.isAndroid(result));
    console.log(DeviceHelper.isBrowser(result));
    const lids = await pool.query(`SELECT * FROM lid`);
    res.status(200).send(lids.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      target_id,
      lid_stage_id,
      test_date,
      trial_lesson_date,
      trial_lesson_time,
      trial_lesson_group_id,
      lid_status_id,
      cancel_reason_id,
    } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "lid"
      SET first_name = $1,
      last_name = $2,
      phone_number = $3,
      target_id = $4,
      lid_stage_id = $5,
      test_date = $6,
      trial_lesson_date = $7,
      trial_lesson_time = $8,
      trial_lesson_group_id = $9,
      lid_status_id = $10,
      cancel_reason_id = $11,
      where id = $12 
      RETURNING *`,
      [
        first_name,
        last_name,
        phone_number,
        target_id,
        lid_stage_id,
        test_date,
        trial_lesson_date,
        trial_lesson_time,
        trial_lesson_group_id,
        lid_status_id,
        cancel_reason_id,
        id,
      ]
    );
    res.send({ msg: "Lid updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM lid WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting lid", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Lid not found" });
        } else {
          res.status(200).send({ message: "Lid deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addlid, getAllLids, updateById, removeById };
