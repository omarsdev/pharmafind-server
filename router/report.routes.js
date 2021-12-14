const router = require("express").Router();

const {
  createPharmacistReport,
  createUserReport,
  getAllUsersReport,
  getAllPharmacistReport,
} = require("../controller/ReportController");

const {
  protectEmployee,
  protectPharmacist,
  protectUser,
} = require("../middleware/auth");

router
  .route("/user")
  .get(protectEmployee, getAllUsersReport)
  .post(protectUser, createUserReport);
router
  .route("/pharmacist")
  .get(protectEmployee, getAllPharmacistReport)
  .post(protectPharmacist, createPharmacistReport);

module.exports = router;
