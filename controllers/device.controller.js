const { sendErrorResponse } = require("../helpers/send_error_res");
const pool = require("../config/db");
const DeviceDetector = require("node-device-detector");
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  osIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});

const addDevice = async (req, res) => {
  try {
    const { user_id, token } = req.body;
    const userAgent = req.headers["user-agent"];
    const result = detector.detect(userAgent);
    const { device, os, client } = result;
    const newdevicetokens = await pool.query(
      `
      INSERT INTO "devicetokens" (
      user_id,
      device,
      os,
      client,
      token)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
      `,
      [user_id, device, os, client, token]
    );

    res.status(201).send(newdevicetokens.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllDevices = async (req, res) => {
  try {
    const devicetokens = await pool.query(`SELECT * FROM "devicetokens"`);
    console.log(devicetokens);
    res.status(200).send(devicetokens.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { user_id, device, os, client, token } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "devicetokens"
        SET user_id=$1
        SET device=$2,
        SET os=$3,
        SET client=$4,
        SET token=$5,
        where id=$6`,
      [user_id, device, os, client, token, id]
    );
    res.send({ msg: "Device updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addDevice, getAllDevices, updateById };
