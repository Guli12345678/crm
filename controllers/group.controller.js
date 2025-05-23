const { sendErrorResponse } = require("../helpers/send_error_res");
const pool = require("../config/db");
const addGroup = async (req, res) => {
  try {
    const {
      name,
      lesson_start_time,
      lesson_end_time,
      lesson_week_day,
      stage_id,
      branch_id,
      room_floor,
      room,
      lessons_quantity,
    } = req.body;
    const newgroup = await pool.query(
      `
      INSERT INTO "group" (
      name,
      lesson_start_time,
      lesson_end_time,
      lesson_week_day,
      stage_id,
      branch_id,
      room_floor,
      room,
      lessons_quantity)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
      `,
      [
        name,
        lesson_start_time,
        lesson_end_time,
        lesson_week_day,
        stage_id,
        branch_id,
        room_floor,
        room,
        lessons_quantity,
      ]
    );
    console.log({ newgroup: newgroup });
    res.status(201).send(newgroup.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const getAllGroups = async (req, res) => {
  try {
    const groups = await pool.query(`SELECT * FROM "group"`);
    console.log({ allgroups: groups });
    res.status(200).send(groups.rows);
  } catch (error) {
    console.log("Err: ", error);
  }
};

const updateById = async (req, res) => {
  try {
    const {
      name,
      lesson_start_time,
      lesson_end_time,
      lesson_week_day,
      stage_id,
      branch_id,
      room_floor,
      room,
      lessons_quantity,
    } = req.body;
    const { id } = req.params;
    const updated = await pool.query(
      `Update "group"
        SET name = $1, lesson_start_time = $2, lesson_end_time = $3, lesson_week_day=$4, stage_id=$5, branch_id=$6, room_floor=$7, room=$8, lessons_quantity=$9 
        where id = $10
        RETURNING *`,
      [
        name,
        lesson_start_time,
        lesson_end_time,
        lesson_week_day,
        stage_id,
        branch_id,
        room_floor,
        room,
        lessons_quantity,
        id,
      ]
    );
    res.send({ msg: "Group updated ✅" });
  } catch (error) {
    console.log("Err: ", error);
  }
};

const removeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM group WHERE id=$1`,
      [id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error deleting group", error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).send({ message: "Group not found" });
        } else {
          res.status(200).send({ message: "Group deleted successfully!" });
        }
      }
    );
  } catch (error) {
    console.log("Err: ", error);
  }
};

module.exports = { addGroup, getAllGroups, updateById, removeById };
