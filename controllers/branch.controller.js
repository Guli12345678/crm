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

const addbranch = async (req, res) => {
  try {
    const { name, address, phone_number } = req.body;
    const newBranch = await pool.query(
      `
      INSERT INTO branch (name, address, phone_number)
      VALUES ($1, $2, $3) RETURNING *
      `,
      [name, address, phone_number]
    );
    console.log({ newBranch: newBranch });
    res.status(201).send(newBranch.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllBranchs = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse: ", result);
    const branchs = await pool.query(`SELECT * FROM branch`);
    res.status(200).send(branchs.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { name, address, phone_number } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "branch"
        SET name = $1, address = $2, phone_number = $3
        where id = $4 
        RETURNING *`,
      [name, address, phone_number, id]
    );
    res.send({ msg: "Branch updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM branch WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting branch", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Branch not found" });
        } else {
          res.status(200).send({ message: "Branch deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addbranch, getAllBranchs, updateById, removeById };
