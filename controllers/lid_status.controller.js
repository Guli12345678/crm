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

const addlidStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const newLidStatus = await pool.query(
      `
      INSERT INTO lid_status (status)
      VALUES ($1) RETURNING *
      `,
      [status]
    );
    console.log({ newLidStatus: newLidStatus });
    res.status(201).send(newLidStatus.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllLidStatuss = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse: ", result);
    const lidStatuss = await pool.query(`SELECT * FROM lid_status`);
    res.status(200).send(lidStatuss.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update lid_status
        SET status = $1 
        where id = $2 
        RETURNING *`,
      [status, id]
    );
    res.send({ msg: "LidStatus updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM lid_status WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting lidStatus", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "LidStatus not found" });
        } else {
          res.status(200).send({ message: "LidStatus deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addlidStatus, getAllLidStatuss, updateById, removeById };


// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/Guli12345678/crm.git
// git push -u origin main