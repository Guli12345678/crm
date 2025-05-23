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

const addpayment = async (req, res) => {
  try {
    const {
      student_id,
      payment_last_date,
      payment_date,
      price,
      is_paid,
      total_attempt,
    } = req.body;
    const newPayment = await pool.query(
      `
      INSERT INTO payment (
      student_id,
      payment_last_date,
      payment_date,
      price,
      is_paid,
      total_attempt)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `,
      [
        student_id,
        payment_last_date,
        payment_date,
        price,
        is_paid,
        total_attempt,
      ]
    );
    console.log({ newPayment: newPayment });
    res.status(201).send(newPayment.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllPayments = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse: ", result);
    const payments = await pool.query(`SELECT * FROM payment`);
    res.status(200).send(payments.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { name, address, phone_number } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "payment"
      SET student_id=$1,
      payment_last_date=$2,
      payment_date=$3,
      price=$4,
      is_paid=$5,
      total_attempt=$6 
      where id = $7 
      RETURNING *`,
      [
        student_id,
        payment_last_date,
        payment_date,
        price,
        is_paid,
        total_attempt,
        id,
      ]
    );
    res.send({ msg: "Payment updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM payment WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting payment", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Payment not found" });
        } else {
          res.status(200).send({ message: "Payment deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addpayment, getAllPayments, updateById, removeById };
