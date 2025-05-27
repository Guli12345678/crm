const uuid = require("uuid");
const otpGenerator = require("otp-generator");
const { sendErrorResponse } = require("../helpers/send_error_res");
const { addMinutesTodate } = require("../helpers/add-Minutes");
const pool = require("../config/db");
const { encode } = require("../helpers/crypt");
const { decode } = require("../helpers/crypt");
const mailService = require("../services/mail.service");

const newOtp = async (req, res) => {
  try {
    const { email, recipient, phone_number } = req.body;

    if (!recipient) {
      return res.status(400).send({ error: "Recipient is required" });
    }

    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expirationTime = addMinutesTodate(now, 5);

    const newOtpDb = await pool.query(
      `
      INSERT INTO otp (id, otp, expiration_time)
      VALUES ($1, $2, $3) RETURNING id
    `,
      [uuid.v4(), otp, expirationTime]
    );

    const details = {
      time: now,
      phone_number,
      sender: email,
      recipient,
      otp_id: newOtpDb.rows[0].id,
    };

    await mailService.sendMail(recipient, otp);
    const encodedData = await encode(JSON.stringify(details));

    res.status(200).send({
      message: "OTP generated",
      verification_key: encodedData,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { verification_key, otp, phone_number } = req.body;
    const decodedData = await decode(verification_key);
    const data = JSON.parse(decodedData);

    if (phone_number !== data.phone_number) {
      return res
        .status(400)
        .send({ message: "OTP bu telefon raqamga yuborilmagan" });
    }
    const otpResult = await pool.query(
      `
      SELECT * FROM otp WHERE id=$1
    `,
      [data.otp_id]
    );
    const result = otpResult.rows[0];
    if (result == null) {
      return res.status(400).send({ message: "Bunday OTP aniqlanmadi" });
    }
    if (result.verified == true) {
      return res.status(400).send({ message: "Bu OTP avval tekshirilgan" });
    }
    if (result.expirationTime < new Date()) {
      return res
        .status(400)
        .send({ message: "Bu OTPning vaqti chiqib ketgan" });
    }
    if (otp != result.otp) {
      return res.status(400).send({ message: "Bu OTP mos emas" });
    }
    await pool.query(
      `
      UPDATE otp 
      SET verified=$2 
      WHERE id=$1
    `,
      [result.id, true]
    );
    const clientResult = await pool.query(
      `Select * from client where phone_number=$1`,
      [phone_number]
    );
    let client_id, isNew;
    if (clientResult.rows.length == 0) {
      const newClient = await pool.query(
        `INSERT INTO client (phone_number,is_active)
        VALUES ($1, $2) RETURNING id
      `,
        [phone_number, true]
      );
      console.log(newClient);
      client_id = newClient.rows[0].id;
      isNew = true;
    } else {
      client_id = clientResult.rows[0].id;
      isNew = false;
      await pool.query(
        `
        UPDATE client SET is_active=true WHERE id=$1
      `,
        [client_id]
      );
    }
    res
      .status(200)
      .send({ message: "OTP tekshiruvdan otdi", isNew, client_id });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
module.exports = {
  newOtp,
  verifyOtp,
};
