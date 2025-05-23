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

const addrole = async (req, res) => {
  try {
    const { name } = req.body;
    const newRole = await pool.query(
      `
      INSERT INTO role (name)
      VALUES ($1) RETURNING *
      `,
      [name]
    );
    console.log({ newRole: newRole });
    res.status(201).send(newRole.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllRoles = async (req, res) => {
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
    const roles = await pool.query(`SELECT * FROM role`);
    res.status(200).send(roles.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "role"
        SET name = $1
        where id = $2 
        RETURNING *`,
      [name, id]
    );
    res.send({ msg: "Role updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM role WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting role", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Role not found" });
        } else {
          res.status(200).send({ message: "Role deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addrole, getAllRoles, updateById, removeById };
