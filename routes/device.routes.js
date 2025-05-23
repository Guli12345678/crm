const {
  addDevice,
  getAllDevices,
  updateById,
} = require("../controllers/device.controller");

const router = require("express").Router();

router.post("/", addDevice);
router.post("/:id", updateById);
router.get("/", getAllDevices);

module.exports = router;
