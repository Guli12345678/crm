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

const addreason = async (req, res) => {
  try {
    const { reason_lid } = req.body;
    const newReason = await pool.query(
      `
      INSERT INTO reason (reason_lid)
      VALUES ($1) RETURNING *
      `,
      [reason_lid]
    );
    console.log({ newReason: newReason });
    res.status(201).send(newReason.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllReasons = async (req, res) => {
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
    const reasons = await pool.query(`SELECT * FROM reason`);
    res.status(200).send(reasons.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { reason_lid } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "reason"
        SET reason_lid = $1
        where id = $2 
        RETURNING *`,
      [reason_lid, id]
    );
    res.send({ msg: "Reason updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM reason WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting reason", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Reason not found" });
        } else {
          res.status(200).send({ message: "Reason deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addreason, getAllReasons, updateById, removeById };
