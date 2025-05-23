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

const addstage = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newStage = await pool.query(
      `
      INSERT INTO STAGE (name, description)
      VALUES ($1, $2) RETURNING *
      `,
      [name, description]
    );
    console.log({ newStage: newStage });
    res.status(201).send(newStage.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllStages = async (req, res) => {
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
    const stages = await pool.query(`SELECT * FROM stage`);
    res.status(200).send(stages.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "stage"
        SET name = $1, description = $2 
        where id = $3 
        RETURNING *`,
      [name, description, id]
    );
    res.send({ msg: "Stage updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(`DELETE FROM stage WHERE id=$1`, [id], (err, results) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Error deleting stage", error: err.message });
      } else if (results.affectedRows === 0) {
        res.status(404).send({ message: "Stage not found" });
      } else {
        res.status(200).send({ message: "Stage deleted successfully!" });
      }
    });
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addstage, getAllStages, updateById, removeById };
