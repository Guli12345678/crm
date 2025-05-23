const { sendErrorResponse } = require("../helpers/send_error_res");
const pool = require("../config/db");
const addgroup_stuff = async (req, res) => {
  try {
    const { group_id, stuff_id } = req.body;
    const newgroup_stuff = await pool.query(
      `
      INSERT INTO group_stuff (group_id, stuff_id)
      VALUES ($1, $2) RETURNING *
      `,
      [group_id, stuff_id]
    );
    console.log({ newgroup_stuff: newgroup_stuff });
    res.status(201).send(newgroup_stuff.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllgroup_stuffs = async (req, res) => {
  try {
    const group_stuffs = await pool.query(`SELECT * FROM group_stuff`);
    console.log({ allgroup_stuffs: group_stuffs });
    res.status(200).send(group_stuffs.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};
module.exports = { addgroup_stuff, getAllgroup_stuffs };
