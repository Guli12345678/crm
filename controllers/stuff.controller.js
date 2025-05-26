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

const addstuff = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, login, parol, is_active } =
      req.body;
    const newStuff = await pool.query(
      `
      INSERT INTO stuff (first_name,last_name, phone_number, login, parol, is_active)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `,
      [first_name, last_name, phone_number, login, parol, is_active]
    );
    console.log({ newStuff: newStuff });
    res.status(201).send(newStuff.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllStuffs = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse: ", result);

    const stuffs = await pool.query(`SELECT * FROM stuff`);
    res.status(200).send(stuffs.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, login, parol, is_active } =
      req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "stuff"
        SET first_name=$1,
        last_name=$2,
        phone_number=$3,
        login=$4,
        parol = $5,
        is_active = $6
        where id = $7 
        RETURNING *`,
      [first_name, last_name, phone_number, login, parol, is_active, id]
    );
    res.send({ msg: "Stuff updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM stuff WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting stuff", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Stuff not found" });
        } else {
          res.status(200).send({ message: "Stuff deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addstuff, getAllStuffs, updateById, removeById };
