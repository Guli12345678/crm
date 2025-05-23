const {
  addgroup_stuff,
  getAllgroup_stuffs,
} = require("../controllers/group_stuff.controller");

const router = require("express").Router();

router.post("/", addgroup_stuff);
router.get("/", getAllgroup_stuffs);

module.exports = router;
