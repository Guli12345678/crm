const {
  addpayment,
  getAllPayments,
  updateById,
  removeById
} = require("../controllers/payment.controller");

const router = require("express").Router();

router.post("/", addpayment);
router.post("/:id", updateById);
router.get("/", getAllPayments);
router.delete("/:id", removeById);

module.exports = router;
