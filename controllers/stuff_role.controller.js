const { sendErrorResponse } = require("../helpers/send_error_res");
const pool = require("../config/db");
const addstuff_role = async (req, res) => {
  try {
    const { role_id, stuff_id } = req.body;
    const newstuff_role = await pool.query(
      `
      INSERT INTO stuff_role (role_id, stuff_id)
      VALUES ($1, $2) RETURNING *
      `,
      [role_id, stuff_id]
    );
    console.log({ newstuff_role: newstuff_role });
    res.status(201).send(newstuff_role.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllstuff_roles = async (req, res) => {
  try {
    const stuff_roles = await pool.query(`SELECT * FROM stuff_role`);
    console.log({ allstuff_roles: stuff_roles });
    res.status(200).send(stuff_roles.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const { role_id, stuff_id } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "stuff_role"
        SET role_id = $1, stuff_id = $2
        where id = $3 
        RETURNING *`,
      [role_id, stuff_id, id]
    );
    res.send({ msg: "Stuff_role updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};
const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM stuff_role WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting reason", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Stuff_role not found" });
        } else {
          res.status(200).send({ message: "Stuff_role deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addstuff_role, getAllstuff_roles, updateById, removeById };
